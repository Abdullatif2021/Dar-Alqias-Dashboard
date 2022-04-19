import { isAuthGuardActive } from "../constants/config";
import { setCurrentUser, getCurrentUser } from ".";
export default (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        console.log(user);
        const roleArrayHierarchic = to.matched
          .filter(x => x.meta.roles)
          .map(x => x.meta.roles);
        console.log(roleArrayHierarchic);
        if (roleArrayHierarchic.every(x => x.includes(user.role[0]))) {
          console.log(roleArrayHierarchic.every(x => x.includes(user.role[0])));
          next();
        } else {
          next("/unauthorized");
        }
      } else {
        setCurrentUser(null);
        next("/user/login");
      }
    } else {
      next();
    }
  } else {
    next();
  }
};
