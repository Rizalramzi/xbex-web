import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Lazy loading for better performance
const Dashboard = () => import('../views/Dashboard.vue');
const AssetList = () => import('../views/asset/AssetList.vue');
const AssetDetail = () => import('../views/asset/AssetDetail.vue');
const AssetForm = () => import('../views/asset/AssetForm.vue');
const MaintenanceList = () => import('../views/maintenance/MaintenanceList.vue');
const MaintenanceDetail = () => import('../views/maintenance/MaintenanceDetail.vue');
const MaintenanceForm = () => import('../views/maintenance/MaintenanceForm.vue');
const Login = () => import('../views/auth/Login.vue');
const MobileLogin = () => import('../views/mobile/Login.vue');
const MobileDashboard = () => import('../views/mobile/Dashboard.vue');
const SignUp = () => import('../views/auth/SignUp.vue');
const ForgotPassword = () => import('../views/auth/ForgotPassword.vue');
const NotFound = () => import('../views/NotFound.vue');
const Reports = () => import('../views/Reports.vue');
const TaskManagement = () => import('../views/TaskManagement.vue');
const WorkOrder = () => import('../views/WorkOrder.vue');
const DefectReport = () => import('../views/DefectReport.vue');
const MaterialStatus = () => import('../views/MaterialStatus.vue');
const SyncData = () => import('../views/SyncData.vue');
const TemplateDesigner = () => import('../views/TemplateDesigner.vue');
const KnowledgeBase = () => import('../views/KnowledgeBase.vue');

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/mobile/login',
    name: 'MobileLogin',
    component: MobileLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/mobile/dashboard',
    name: 'MobileDashboard',
    component: MobileDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/task-management',
    name: 'MobileTaskManagement',
    component: TaskManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/work-order',
    name: 'MobileWorkOrder',
    component: WorkOrder,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/work-order/:id',
    name: 'MobileWorkOrderDetail',
    component: () => import('../views/mobile/WorkOrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/work-order/:workOrderId/task/:taskId',
    name: 'MobileWorkOrderTask',
    component: () => import('../views/mobile/WorkOrderTask.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/defect-report',
    name: 'MobileDefectReport',
    component: DefectReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/material-status',
    name: 'MobileMaterialStatus',
    component: MaterialStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/sync-data',
    name: 'MobileSyncData',
    component: SyncData,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/knowledge-base',
    name: 'MobileKnowledgeBase',
    component: KnowledgeBase,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/assets',
    name: 'MobileAssets',
    component: AssetList,
    meta: { requiresAuth: true }
  },
  {
    path: '/mobile/reports',
    name: 'MobileReports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  // Transaction Menu Routes
  {
    path: '/task',
    name: 'TaskManagement',
    component: TaskManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/work-order',
    name: 'WorkOrder',
    component: WorkOrder,
    meta: { requiresAuth: true }
  },
  {
    path: '/defect',
    name: 'DefectReport',
    component: DefectReport,
    meta: { requiresAuth: true }
  },
  {
    path: '/material-status',
    name: 'MaterialStatus',
    component: MaterialStatus,
    meta: { requiresAuth: true }
  },
  {
    path: '/sync-data',
    name: 'SyncData',
    component: SyncData,
    meta: { requiresAuth: true }
  },
  {
    path: '/template-designer',
    name: 'TemplateDesigner',
    component: TemplateDesigner,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBase,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets',
    name: 'Assets',
    component: AssetList,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets/new',
    name: 'CreateAsset',
    component: AssetForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets/:id',
    name: 'AssetDetail',
    component: AssetDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets/:id/edit',
    name: 'EditAsset',
    component: AssetForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: MaintenanceList,
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance/new',
    name: 'CreateMaintenance',
    component: MaintenanceForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance/:id',
    name: 'MaintenanceDetail',
    component: MaintenanceDetail,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/maintenance/:id/edit',
    name: 'EditMaintenance',
    component: MaintenanceForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
