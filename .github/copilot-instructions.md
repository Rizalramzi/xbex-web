<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Asset Maintenance Management System - Copilot Instructions

This is a Vue 3 application for managing assets and their maintenance schedules. The app uses:

- Vue 3 Composition API with `<script setup>`
- Vite as the build tool
- Tailwind CSS for styling
- Pinia for state management
- Vue Router for client-side routing
- Axios for API requests

## Project Structure

- `src/assets`: Static files
- `src/components`: Reusable Vue components
- `src/router`: Vue Router configuration
- `src/services`: API service files using Axios
- `src/stores`: Pinia stores for state management
- `src/views`: Application pages organized by feature

## Code Style Guidelines

- Use the Composition API with `<script setup>` syntax
- Use named exports for components, stores, and services
- Use PascalCase for component names
- Use camelCase for variable and function names
- Use async/await for asynchronous operations
- Use `ref`, `reactive`, and `computed` for reactivity
- Use Tailwind utility classes for styling

## Features

The application manages:
- Assets (equipment, machinery, vehicles, etc.) - 47 mining-specific assets
- Maintenance records and schedules 
- Work Orders (planned and unplanned maintenance)
- Tasks (detailed maintenance activities with instructions and feedback)
- Item management (parts, supplies, and materials required for tasks)
- Defect tracking (issues discovered during maintenance)
- Asset categories and statuses
- Maintenance types and priorities

### Dashboard Features

The Site Manager dashboard includes elegant KPI cards with traffic light indicators:

- **Work Order KPI**: Shows uncompleted/completed work orders with completion rate
- **Item Availability KPI**: Percentage of items available for required tasks
- **Critical Stock KPI**: Number of items with critical stock levels
- **Task Completion KPI**: Average task progress completion percentage

Each KPI card features:
- Traffic light indicator (green/yellow/red) based on performance thresholds
- Animated progress bars with gradient colors
- Hover effects and professional styling
- Clear metrics and contextual messages

## Mock Data

The application uses comprehensive mock data relevant to Petrosea mining operations:
- `assets-extended.json`: 47 mining equipment assets (excavators, dump trucks, crushers, etc.)
- `work-orders.json`: 13 work orders covering planned and unplanned maintenance
- `tasks.json`: Detailed maintenance tasks with instructions, progress tracking, and feedback
- `task-items.json`: Parts and materials required for tasks with warehouse status
- `defects.json`: Defects discovered during maintenance with resolution tracking

### Pinia Stores

- `assetStore.js`: Asset management and filtering
- `maintenanceStore.js`: Maintenance records and scheduling
- `workOrderStore.js`: Work order tracking with computed statistics
- `itemStore.js`: Inventory management with stock status analysis
- `taskStore.js`: Task progress tracking and item availability calculations

## Future Improvements

Consider these areas for improvement:
- Authentication and user management
- File uploads for asset documentation
- Reporting and analytics
- Notification system for maintenance reminders
- Mobile app integration
