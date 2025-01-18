from flask.json import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask import Flask, request
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
from flask_cors import CORS
import uuid
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///database/user.db"
db = SQLAlchemy(app)

UPLOAD_FOLDER_POST = './../app/public/media/upload/posts'
UPLOAD_FOLDER_USER = './../app/public/media/upload/users'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}
app.config['UPLOAD_FOLDER_POST'] = UPLOAD_FOLDER_POST
app.config['UPLOAD_FOLDER_USER'] = UPLOAD_FOLDER_USER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#Models
class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    senha = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.Integer, nullable=False, default=0)
    data_cadastro = db.Column(db.DateTime, default=datetime.utcnow)
    foto = db.Column(db.String(1000))
    bio = db.Column(db.String(240))
    api_key = db.Column(db.String(36), unique=True, default=lambda: str(uuid.uuid4()))

    def __repr__(self):
        return f"User(nome={self.nome}, email={self.email}, data_cadastro={self.data_cadastro})"

    def to_dict(self):
        user_data = {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'tipo': self.tipo,
            'data_cadastro': self.data_cadastro,
            'foto': self.foto,
            'bio': self.bio,
            'api_key': self.api_key,
        }
        return user_data

class PostModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(120), nullable=False)
    conteudo = db.Column(db.Text, nullable=False)
    media = db.Column(db.String(1000), nullable=True)
    data_postagem = db.Column(db.DateTime, default=datetime.utcnow)
    views = db.Column(db.Integer, default= 0)
    likes = db.Column(db.Integer, default= 0)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user_model.id'), nullable=False)
    usuario = db.relationship('UserModel', backref='posts')
    categoria_id = db.Column(db.Integer, db.ForeignKey('category_model.id'), nullable=False )
    categoria = db.relationship('CategoryModel', backref='posts')

    def __repr__(self):
        return f"Post(titulo={self.titulo}, conteudo={self.conteudo}, media={self.media}, views={self.views}, likes={self.likes}, data_postagem={self.data_cadastro}, usuario_id={self.usuario_id}, categoria_id={self.categoria_id})"

    def to_dict(self):
        post_data = {
            'id': self.id,
            'titulo': self.titulo,
            'conteudo': self.conteudo,
            'media': self.media,
            'views': self.views,
            'likes': self.likes,
            'data_postagem': self.data_postagem,
            'usuario_id': self.usuario_id,
            'categoria_id': self.categoria_id,
        }
        return post_data

class CategoryModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Category(nome={self.nome})"

    def to_dict(self):
        category_data = {
            'id': self.id,
            'nome': self.nome,
        }
        return category_data

class CommentModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conteudo = db.Column(db.Text, nullable=False)
    data_comentario = db.Column(db.DateTime, default=datetime.utcnow)
    likes =  db.Column(db.Integer, default= 0)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user_model.id'), nullable=False)
    usuario = db.relationship('UserModel', backref='comments')
    postagem_id = db.Column(db.Integer, db.ForeignKey('post_model.id'), nullable=False)
    postagem = db.relationship('PostModel', backref='comments')

    def __repr__(self):
        return f"Comment(conteudo={self.conteudo}, likes={self.likes}, data_comentario={self.data_postagem}, usuario_id={self.usuario_id}, postagem_id={self.postagem_id})"

    def to_dict(self):
        comment_data = {
            'id': self.id,
            'conteudo': self.conteudo,
            'likes': self.likes,
            'data_comentario': self.data_comentario,
            'usuario_id': self.usuario_id,
            'postagem_id': self.postagem_id,
        }
        return comment_data

#db.create_all()

#Args
user_put_args = reqparse.RequestParser()
user_put_args.add_argument("nome", type=str, help="Nome é necessário", required=True)
user_put_args.add_argument("email", type=str, help="E-mail é necessário", required=True)
user_put_args.add_argument("senha", type=str, help="Senha é necessária", required=True)
user_put_args.add_argument("tipo", type=int, help="Tipo é necessário", required=True)
user_put_args.add_argument("foto", type=str, help="URL ou caminho da mídia", required=False)
user_put_args.add_argument("bio", type=str, help="Descrição do usuário", required=False)

post_put_args = reqparse.RequestParser()
post_put_args.add_argument("titulo", type=str, help="Título é necessário", required=True)
post_put_args.add_argument("conteudo", type=str, help="Conteúdo é necessário", required=True)
post_put_args.add_argument("media", type=str, help="URL ou caminho da mídia", required=False)
post_put_args.add_argument("usuario_id", type=int, help="ID do usuário é necessário", required=True)
post_put_args.add_argument("categoria_id", type=int, help="ID da postagem é necessária", required=True)
post_put_args.add_argument("views", type=int, help="Views não é obrigatória", required=False)
post_put_args.add_argument("likes", type=int, help="Likes não é obrigatório", required=False)

category_put_args = reqparse.RequestParser()
category_put_args.add_argument("nome", type=str, help="Nome é necessário", required=True)

comment_put_args = reqparse.RequestParser()
comment_put_args.add_argument("conteudo", type=str, help="Conteúdo é necessário", required=True)
comment_put_args.add_argument("usuario_id", type=int, help="ID do usuário é necessário", required=True)
comment_put_args.add_argument("postagem_id", type=int, help="ID do usuário é necessário", required=True)

#Fields
user_fields = {
    'id': fields.Integer,
    'nome': fields.String,
    'email': fields.String,
    'tipo': fields.Integer,
    'data_cadastro': fields.DateTime,
    'foto': fields.String,
    'bio': fields.String,
    'api_key' : fields.String
}

post_fields = {
    'id': fields.Integer,
    'titulo': fields.String,
    'conteudo': fields.String,
    'media': fields.String,
    'data_postagem': fields.DateTime,
    'views': fields.Integer,
    'likes': fields.Integer,
    'usuario_id': fields.Integer,
    'categoria_id': fields.Integer
}

category_fields = {
    'id': fields.Integer,
    'nome': fields.String,
}

comment_fields = {
    'id': fields.Integer,
    'conteudo': fields.String,
    'data_comentario': fields.DateTime,
    'likes': fields.Integer,
    'usuario_id': fields.Integer,
    'postagem_id': fields.Integer
}

#Resources
class Pong(Resource) :
    def get(self):
        message = {'message' : "pong"}
        return message

class User(Resource):
    @marshal_with(user_fields)
    def get(self, user_id=None, user_email=None):
        if user_id :
            result = UserModel.query.filter_by(id=user_id).first()
        elif user_email :
            result = UserModel.query.filter_by(email=user_email).first()
        else :
            result = UserModel.query.all()

        if not result:
            abort(404, message="Usuário não encontrado!")

        if isinstance(result, list):
            return [user.to_dict() for user in result]
        
        return result.to_dict()
    
    @marshal_with(user_fields)
    def post(self):
        args = user_put_args.parse_args()
        hashed_password = generate_password_hash(args['senha'])
        user = UserModel(nome=args['nome'], email=args['email'], senha=hashed_password, tipo=args['tipo'])
        db.session.add(user)
        db.session.commit()
        return user.to_dict(), 201
    
    @marshal_with(user_fields)
    def put(self, api_key, user_id):
        args = user_put_args.parse_args()

        if not api_key:
            abort(401, message="API Key é obrigatória!")

        usuario_dono_da_key = UserModel.query.filter_by(api_key=api_key).first()
        if not usuario_dono_da_key:
            abort(403, message="API Key inválida!")

        if usuario_dono_da_key.id != user_id:
            abort(403, message="Usuário não autorizado a realizar essa operação!")

        result = UserModel.query.filter_by(id=user_id).first()
        if not result:
            abort(404, message="Usuário não encontrado para atualizar!")

        result.nome = args['nome']
        result.email = args['email']
        result.senha = generate_password_hash(args['senha'])
        result.tipo = args['tipo']
        result.foto = args['foto']
        result.bio = args['bio']

        db.session.commit()

        return result.to_dict(), 200

    def delete(self, api_key, user_id):
        if not api_key:
            abort(401, message="API Key é obrigatória!")

        usuario_dono_da_key = UserModel.query.filter_by(api_key=api_key).first()
        if not usuario_dono_da_key:
            abort(403, message="API Key inválida!")

        if usuario_dono_da_key.id != user_id:
            abort(403, message="Usuário não autorizado a realizar essa operação!")

        result = UserModel.query.filter_by(id=user_id).first()
        if not result:
            abort(404, message="Usuário não encontrado para atualizar!")
        
        db.session.delete(result)
        db.session.commit()
        return "", 204

class Post(Resource):
    @marshal_with(post_fields)
    def get(self, type=None, id=None):
        if id and not type:
            abort(400, message="Tipo é necessário! (id / categoria / usuario)")
        if type and not id:
            abort(400, message="Id é necessário! (id_postagem / id_categoria / id_usuario)")

        if type == 'id':
            result = PostModel.query.filter_by(id=id).first()
            if not result:
                abort(404, message="Post não encontrado!")
            return result.to_dict()
        
        elif type == 'categoria':
            results = PostModel.query.filter_by(categoria_id=id).order_by(PostModel.data_postagem.desc()).all()
            if not results:
                abort(404, message="Nenhum post encontrado")
            return [post.to_dict() for post in results]
        
        elif type == 'usuario':
            results = PostModel.query.filter_by(usuario_id=id).order_by(PostModel.data_postagem.desc()).all()
            if not results:
                abort(404, message="Nenhum post encontrado")
            return [post.to_dict() for post in results]
        
        elif not type :
            posts = PostModel.query.order_by(PostModel.data_postagem.desc()).all()
            if not posts:
                abort(404, message="Nenhum post encontrado!")
            return [post.to_dict() for post in posts]
        
        else :
            abort(422, message="Tipo inexistente! Tente: (id / categoria / usuario)")
    
    @marshal_with(post_fields)
    def post(self):
        args = post_put_args.parse_args()
        file = request.files.get('media')
        
        if file and allowed_file(file.filename):
            random_filename = str(uuid.uuid4())
            extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{random_filename}.{extension}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER_POST'], filename))
            
            post = PostModel(
                titulo=args['titulo'],
                conteudo=args['conteudo'],
                media=filename,
                usuario_id=args['usuario_id'],
                categoria_id=args['categoria_id']
            )
            db.session.add(post)
            db.session.commit()

            return post.to_dict(), 201

        abort(400, message="Arquivo inválido ou não enviado.")
    
    @marshal_with(post_fields)
    def put(self, post_id):
        args = post_put_args.parse_args()
        post = PostModel.query.filter_by(id=post_id).first()

        if not post:
            abort(404, message="Post não encontrado.")

        post.titulo = args['titulo']
        post.conteudo = args['conteudo']
        post.usuario_id = args['usuario_id']
        post.categoria_id = args['categoria_id']
        post.views = args['views']
        post.likes = args['likes']

        file = request.files.get('media')

        if file and allowed_file(file.filename):
            random_filename = str(uuid.uuid4())
            extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{random_filename}.{extension}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER_POST'], filename))

            post.media = filename

        db.session.commit()

        return post.to_dict(), 200

    def delete(self, post_id):
        result = PostModel.query.filter_by(id=post_id).first()
        if not result:
            abort(404, message="Post não encontrado!")

        comments = CommentModel.query.filter_by(postagem_id=post_id).all()
        
        for comment in comments:
            db.session.delete(comment)
            db.session.commit()
        
        db.session.commit()

        db.session.delete(result)
        db.session.commit()

        return {"message": "Post deletado com sucesso!"}, 200

class Category(Resource):
    @marshal_with(category_fields)
    def get(self, category_id=None):
        
        if category_id :
            result = CategoryModel.query.filter_by(id=category_id).first()
        else :
            result = CategoryModel.query.all()

        if not result:
            abort(404, message="Categoria não encontrada!")
            
        if isinstance(result, list):
            return [category.to_dict() for category in result]
        
        return result.to_dict()
    
    @marshal_with(category_fields)
    def post(self):
        args = category_put_args.parse_args()
        category = CategoryModel(nome=args['nome'])
        db.session.add(category)
        db.session.commit()
        return category, 201
    
    @marshal_with(category_fields)
    def put(self, category_id):
        args = category_put_args.parse_args()

        result = CategoryModel.query.filter_by(id=category_id).first()
        if not result:
            abort(404, message="Usuário não encontrado para atualizar!")

        result.nome = args['nome']

        db.session.commit()

        return result.to_dict(), 200

    def delete(self, category_id):
        result = CategoryModel.query.filter_by(id=category_id).first()
        if not result:
            abort(404, message="Categoria não encontrada!")
        
        db.session.delete(result)
        db.session.commit()
        return "", 204

class Comment(Resource):
    @marshal_with(comment_fields)
    def get(self, type=None, id=None, usuario=None):
        if not type:
            abort(401, message="Tipo é necessário! (id / post / user)")
        if not id:
            abort(401, message="Id é necessário! (comment_id / postagem_id / user_id)")
        if (type == 'id' or type == 'user') and usuario:
            abort(405, message="Ação não permitida!")

        if type == 'id':
            result = CommentModel.query.filter_by(id=id).first()
            if not result:
                abort(404, message='Comentário não encontrado!')
            return result.to_dict()
        
        elif type == 'post':
            if usuario :
                comments = CommentModel.query.filter_by(postagem_id=id, usuario_id=usuario).order_by(CommentModel.data_comentario.desc()).all()
            else :
                comments = CommentModel.query.filter_by(postagem_id=id).order_by(CommentModel.data_comentario.desc()).all()

        elif type == 'user':
            comments = CommentModel.query.filter_by(usuario_id=id).order_by(CommentModel.data_comentario.desc()).all()
        
        else:
            abort(404, message="Tipo não condiz! (id / post / user)")

        if not comments:
            return jsonify([])
        
        return [comment.to_dict() for comment in comments]

    
    @marshal_with(comment_fields)
    def post(self):
        args = comment_put_args.parse_args()
        comment = CommentModel(conteudo=args['conteudo'], usuario_id=args['usuario_id'], postagem_id=args['postagem_id'])
        db.session.add(comment)
        db.session.commit()
        return comment.to_dict(), 201
    
    @marshal_with(comment_fields)
    def put(self, comment_id):
        args = comment_put_args.parse_args()
        result = CommentModel.query.filter_by(id=comment_id).first()
        if result:
            abort(409, message="Comentário já cadastrado!")

        comment = CommentModel(conteudo=args['conteudo'], usuario_id=args['usuario_id'], postagem_id=args['postagem_id'])
        db.session.add(comment)
        db.session.commit()
        return comment.to_dict(), 201

    def delete(self, comment_id):
        result = CommentModel.query.filter_by(id=comment_id).first()
        if not result:
            abort(404, message="Comentário não encontrado!")
        
        db.session.delete(result)
        db.session.commit()
        return "", 204

#URI API
api.add_resource(Pong, "/api/v0.0.1/ping")
api.add_resource(User, "/api/v0.0.1/user", "/api/v0.0.1/user/id/<int:user_id>", "/api/v0.0.1/user/email/<string:user_email>" , "/api/v0.0.1/user/<string:api_key>/<int:user_id>")
api.add_resource(Post, "/api/v0.0.1/post", "/api/v0.0.1/post/<string:type>", "/api/v0.0.1/post/<string:type>/<int:id>", "/api/v0.0.1/post/<int:post_id>")
api.add_resource(Category, "/api/v0.0.1/categoria", "/api/v0.0.1/categoria/<int:category_id>")
api.add_resource(Comment, "/api/v0.0.1/comment", "/api/v0.0.1/comment/<string:type>/<int:id>", "/api/v0.0.1/comment/<string:type>/<int:id>/<int:usuario>")


if __name__ == "__main__":
    app.run(debug=True)