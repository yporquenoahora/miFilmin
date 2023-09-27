export const embedParams = (function() {

    let _embedParams = {};

    const add = paramData => {
        _embedParams = {..._embedParams, ...paramData};
    };

    const get = () => _embedParams;

    return {
        add,
        get
    };
})();
