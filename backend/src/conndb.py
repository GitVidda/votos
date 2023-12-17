from flask import Flask, request, jsonify
from flask_cors import CORS
from dao import ListDAO, UserDAO, AuditDAO
from dto import ListDTO, UserDTO, AuditDTO

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/votedb'
CORS(app)

list_dao = ListDAO(app)

user_dao = UserDAO(app)

audit_dao = AuditDAO(app)


def list_dto(dao_obj):
    res_dto = ListDTO(dao_obj['_id'], dao_obj['name'], dao_obj['votes'])
    return res_dto


def user_dto(dao_obj):
    res_dto = UserDTO(dao_obj['_id'], dao_obj['ci'], dao_obj['user'], dao_obj['voted'], dao_obj['permission'])
    return res_dto


def audit_dto(dao_obj):
    res_dto = AuditDTO(dao_obj['_id'], dao_obj['user'], dao_obj['time'])
    return res_dto


@app.route('/list', methods=['POST'])
def create_list():
    data = request.get_json()
    name = data.get('name')
    created_list = list_dao.create_list(name)
    if created_list:
        res_dto = list_dto(created_list)
        return jsonify({
            '_id': str(created_list['_id']),
            'name': res_dto.name,
            'votes': res_dto.votes
        })
    else:
        return jsonify({
            'exists': True
        })


@app.route('/lists', methods=['GET'])
def read_lists():
    lists = list_dao.get_all_lists()
    lists_dto = [list_dto(list_item) for list_item in lists]
    return jsonify([list_item.__dict__ for list_item in lists_dto])


@app.route('/list/<list_id>', methods=['GET'])
def read_list(list_id):
    fetched_list = list_dao.get_list(list_id)
    res_dto = list_dto(fetched_list)
    return jsonify({
        '_id': str(fetched_list['_id']),
        'name': res_dto.name,
        'votes': res_dto.votes
    })


@app.route('/list/<list_id>', methods=['POST'])
def update_list(list_id):
    data = request.get_json()
    name = data.get('name')
    updated_list = list_dao.edit_list(list_id, name)
    res_dto = list_dto(updated_list)
    return jsonify({
        '_id': str(updated_list['_id']),
        'name': res_dto.name,
        'votes': res_dto.votes
    })


@app.route('/list/<list_id>', methods=['DELETE'])
def delete_list(list_id):
    deleted_list = list_dao.delete_list(list_id)
    res_dto = list_dto(deleted_list)
    return jsonify({
        '_id': str(deleted_list['_id']),
        'name': res_dto.name,
        'votes': res_dto.votes
    })


@app.route('/lists/<list_id>', methods=['POST'])
def inc_vote(list_id):
    updated_list = list_dao.increment_vote(list_id)
    res_dto = list_dto(updated_list)
    return jsonify({
        'name': res_dto.name,
        'votes': res_dto.votes
    })


@app.route('/lists/<user_id>/voted', methods=['POST'])
def voted(user_id):
    updated_user = user_dao.voted(user_id)
    res_dto = user_dto(updated_user)
    return jsonify({
        'ci': res_dto.ci,
        'user': res_dto.user,
        'voted': res_dto.voted
    })


@app.route('/user', methods=['POST'])
def create_user():
    data = request.get_json()
    ci = data.get('ci')
    user = data.get('user')
    has_voted = data.get('voted')
    permission = data.get('permission')
    created_user = user_dao.create_user(ci, user, has_voted, permission)
    if created_user:
        res_dto = user_dto(created_user)
        return jsonify({
            '_id': str(created_user['_id']),
            'ci': res_dto.ci,
            'user': res_dto.user,
            'voted': res_dto.voted,
            'permission': res_dto.permission
        })
    else:
        return jsonify({
            'exists': True
        })


@app.route('/users', methods=['GET'])
def read_users():
    users = user_dao.get_all_users()
    res_dto = [user_dto(user_item) for user_item in users]
    return jsonify([user_item.__dict__ for user_item in res_dto])


@app.route('/user/<user_id>', methods=['GET'])
def read_user(user_id):
    user = user_dao.get_user(user_id)
    res_dto = user_dto(user)
    return jsonify({
        '_id': str(user['_id']),
        'ci': res_dto.ci,
        'user': res_dto.user,
        'voted': res_dto.voted,
        'permission': res_dto.permission
    })


@app.route('/user/<user_id>', methods=['POST'])
def update_user(user_id):
    data = request.get_json()
    ci = data.get('ci')
    user = data.get('user')
    has_voted = data.get('voted')
    permission = data.get('permission')
    updated_user = user_dao.edit_user(user_id, ci, user, has_voted, permission)
    res_dto = user_dto(updated_user)
    return jsonify({
        '_id': str(updated_user['_id']),
        'ci': res_dto.ci,
        'user': res_dto.user,
        'voted': res_dto.voted,
        'permission': res_dto.permission
    })


@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted_user = user_dao.delete_user(user_id)
    res_dto = user_dto(deleted_user)
    return jsonify({
        '_id': str(deleted_user['_id']),
        'ci': res_dto.ci,
        'user': res_dto.user,
        'voted': res_dto.voted,
        'permission': res_dto.permission
    })


@app.route('/login', methods=['POST'])
def compare_data():
    data = request.get_json()
    _id = data.get('_id')
    ci = data.get('ci')
    exists = user_dao.verify(_id, ci)
    if exists:
        res_dto = UserDTO(exists['_id'], exists['ci'], exists['user'], exists['voted'], exists['permission'])
        return jsonify({
            'exists': True,
            'user': res_dto.user,
            'voted': res_dto.voted,
            'permission': res_dto.permission
        })
    else:
        return jsonify({
            'exists': False
        })


@app.route('/audits', methods=['GET'])
def read_audits():
    audits = audit_dao.get_all_audits()
    res_dto = [audit_dto(audit_item) for audit_item in audits]
    return jsonify([audit_item.__dict__ for audit_item in res_dto])


@app.route('/audit', methods=['POST'])
def authenticate():
    user = request.json['user']
    audit_dao.record_audit(user)
    return jsonify({'message': 'Authentication successful'})


if __name__ == "__main__":
    app.run()
