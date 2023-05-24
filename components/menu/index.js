// components/menu/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        menu: {
            type: Array,
            value: []
        },
        menuIndex: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        handleMenuItem(e) {
            const menuIndex = e.currentTarget.dataset.index
            this.setData({
                menuIndex
            })
            this.triggerEvent("menuItemClick", menuIndex)

        },
    }
})