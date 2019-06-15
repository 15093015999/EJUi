export default {
    namespace: 'pathModel',
    state: {
        currentPath: ''
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((pathname) => {
                dispatch({
                    type: 'save',
                    payload:pathname.pathname
                });
            })
        }
    },
    effects: {},
    reducers: {
        save(state, action) {
            return { ...state, currentPath:action.payload };
        },
    },
}
