from bson import ObjectId
from flask_pymongo import PyMongo
from datetime import datetime


class ListDAO:
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.db = self.mongo.db.lists

    def create_list(self, name):
        list_doc = self.db.find_one({'name': name})
        if list_doc:
            return None
        else:
            self.db.insert_one({'name': name, 'votes': 0})
            inserted_doc = self.db.find_one({'name': name})
            return inserted_doc

    def get_all_lists(self):
        lists = []
        for doc in self.db.find():
            list_data = {
                '_id': str(ObjectId(doc['_id'])),
                'name': doc['name'],
                'votes': doc['votes']
            }
            lists.append(list_data)
        return lists

    def get_list(self, user_id):
        obj = ObjectId(user_id)
        id_result = self.db.find_one({'_id': obj})
        return id_result

    def edit_list(self, list_id, name):
        obj = ObjectId(list_id)
        self.db.update_one({'_id': obj}, {'$set': {'name': name}})
        id_result = self.db.find_one(({'_id': obj}))
        return id_result

    def delete_list(self, list_id):
        obj = ObjectId(list_id)
        id_result = self.db.find_one(({'_id': obj}))
        self.db.delete_one({'_id': obj})
        return id_result

    def increment_vote(self, list_id):
        self.db.update_one({'_id': ObjectId(list_id)}, {'$inc': {'votes': 1}})
        updated_doc = self.db.find_one({'_id': ObjectId(list_id)})
        return updated_doc


class UserDAO:
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.db = self.mongo.db.users

    def create_user(self, ci, user, voted, permission):
        list_doc = self.db.find_one({'ci': ci})
        if list_doc:
            return None
        else:
            self.db.insert_one({'ci': ci, 'user': user, 'voted': voted, 'permission': permission})
            inserted_doc = self.db.find_one({'ci': ci, 'user': user, 'voted': voted, 'permission': permission})
            return inserted_doc

    def get_all_users(self):
        users = []
        for doc in self.db.find():
            list_data = {
                '_id': str(ObjectId(doc['_id'])),
                'ci': doc['ci'],
                'user': doc['user'],
                'voted': doc['voted'],
                'permission': doc['permission']
            }
            users.append(list_data)
        return users

    def get_user(self, user_id):
        obj = ObjectId(user_id)
        id_result = self.db.find_one({'_id': obj})
        return id_result

    def edit_user(self, user_id, ci, user, voted, permission):
        obj = ObjectId(user_id)
        self.db.update_one({'_id': obj}, {'$set': {'ci': ci,
                                                   'user': user,
                                                   'voted': voted,
                                                   'permission': permission
                                                   }})

        id_result = self.db.find_one(({'_id': obj}))
        return id_result

    def delete_user(self, user_id):
        obj = ObjectId(user_id)
        id_result = self.db.find_one(({'_id': obj}))
        self.db.delete_one({'_id': obj})
        return id_result

    def verify(self, _id, ci):
        obj = ObjectId(_id)
        id_ci_result = self.db.find_one({'_id': obj, 'ci': ci})
        return id_ci_result

    def voted(self, user_id):
        self.db.update_one({'_id': ObjectId(user_id)}, {"$set": {'voted': True}})
        updated_doc = self.db.find_one({'_id': ObjectId(user_id)})
        return updated_doc


class AuditDAO:
    def __init__(self, app):
        self.mongo = PyMongo(app)
        self.db = self.mongo.db.audit

    def get_all_audits(self):
        audit = []
        for doc in self.db.find():
            list_data = {
                '_id': str(ObjectId(doc['_id'])),
                'user': doc['user'],
                'time': doc['time'],
            }
            audit.append(list_data)
        return audit

    def record_audit(self, username):
        time = datetime.now()
        self.db.insert_one({'user': username, 'time': time})
