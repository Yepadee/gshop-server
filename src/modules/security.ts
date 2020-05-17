

export const isAuthenticated = () => next => async (root, args, context, info) => {
    console.log("TEST");
    if (!context.currentUser) {
      throw new Error('You are not authenticated!');
    }
  
    return next(root, args, context, info);
  };
  
  export const hasRole = (role: string) => next => async (root, args, context, info) => {
    if (!context.currentUser.roles || context.currentUser.roles.includes(role)) {
      throw new Error('You are not authorized!');
    }
  
    return next(root, args, context, info);
  };