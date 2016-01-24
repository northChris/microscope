// check that the userId specified owns the Documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
};
