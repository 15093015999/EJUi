export default {
    subscriptions: {
        setup({ dispatch, history }) {
            console.log(history.location.pathname);
            //  曾经登录过，调到该权限可以看到的界面
            if (!!isLogin()) {
                if (history.location.pathname === '/') {
                    //  根据角色跳到该角色的首页
                    router.replace(toPage(role))
                }
                //    没有权限跳到login
                if (!isAuthed(history.location.pathname)) {
                    router.replace('/login')
                }
            } else {
                router.replace('/login')
            }

            return history.listen(({ pathname, query }) => {
                // 路由一旦改变就会进入执行
                // 当logout时，进入login会陷入死循环，所以加了层判断
                if (pathname !== '/login') {
                    if (!!isLogin()) {
                        dispatch({ type: 'loginStatus', payload: { isLogin: true } });
                        if (!!isAuthed(pathname)) {
                            dispatch({ type: 'authStatus', payload: { isAuthed: true } })
                        } else {
                            router.replace('/login')
                        }
                    } else {
                        dispatch({ type: 'loginStatus', payload: { isLogin: false } });
                        router.replace('/login')
                    }
                }
            });
        },
    },
}