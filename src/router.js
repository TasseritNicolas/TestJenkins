/*
// router.js
import { createRouter, createWebHistory } from 'vue-router';
import SideBar from './components/SideBar.vue';
import WorkSpaceView from "@/views/WorkSpaceView.vue";
import BoardView from "@/views/BoardView.vue";

const routes = [
    { path: '/', component: SideBar,WorkSpaceView },
    { path: '/board', component: BoardView,SideBar }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
*/
