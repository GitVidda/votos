class ListDTO:
    def __init__(self, _id, name, votes):
        self._id = _id
        self.name = name
        self.votes = votes


class UserDTO:
    def __init__(self, _id, ci, user, voted, permission):
        self._id = _id
        self.ci = ci
        self.user = user
        self.voted = voted
        self.permission = permission


class AuditDTO:
    def __init__(self, _id, user, time):
        self._id = _id
        self.user = user
        self.time = time

