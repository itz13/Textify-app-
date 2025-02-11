import * as React from "react";
import { createRoot } from "react-dom/client";

// Import Spark components
import {
  SparkApp,
  PageContainer,
  Input,
  Button,
  Card,
  Checkbox,
  Link,
} from "@github/spark/components";

// Import useKV hook for persisting data
import { useKV } from "@github/spark/hooks";

// Import icons
import {
  PaperPlaneTilt,
  House,
  ListChecks,
  User,
} from "@phosphor-icons/react";

// Navigation bar component
function NavBar({ activeTab, setActiveTab }) {
  return (
    <nav className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-6">
      <div className="text-2xl font-bold">To-Do App</div>
      <div className="flex space-x-4">
        <Link
          href="#"
          onClick={() => setActiveTab("home")}
          className={`flex items-center ${
            activeTab === "home" ? "text-accent-9" : "text-fg"
          }`}
        >
          <House className="mr-2" />
          Home
        </Link>
        <Link
          href="#"
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center ${
            activeTab === "tasks" ? "text-accent-9" : "text-fg"
          }`}
        >
          <ListChecks className="mr-2" />
          Task Navigator
        </Link>
        <Link
          href="#"
          onClick={() => setActiveTab("user")}
          className={`flex items-center ${
            activeTab === "user" ? "text-accent-9" : "text-fg"
          }`}
        >
          <User className="mr-2" />
          User Manager
        </Link>
      </div>
    </nav>
  );
}

// Task component to render individual tasks
function Task({ task, toggleTask }) {
  return (
    <Card className="p-3 flex-grow min-w-[200px]">
      <div className="flex items-center">
        {/* Checkbox to mark task as completed */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="mr-3"
        />
        {/* Task text */}
        <span className={task.completed ? "line-through text-fg-secondary" : ""}>
          {task.text}
        </span>
      </div>
    </Card>
  );
}

// Main To-Do App component
function TodoApp() {
  // Use useKV hook to persist tasks data
  const [tasks, setTasks] = useKV("todo-tasks", []);
  // State for new task input
  const [newTask, setNewTask] = React.useState("");
  // State for active tab in navigation
  const [activeTab, setActiveTab] = React.useState("home");

  // Function to add a new task
  const addTask = () => {
    if (newTask.trim() !== "") {
      // Add the new task to the tasks array
      setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
      setNewTask("");
    }
  };

  // Function to toggle task completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Render tasks in a flex-wrap container
  const renderTasks = () => (
    <div className="flex flex-wrap gap-4 pb-4">
      {tasks.map((task) => (
        <Task key={task.id} task={task} toggleTask={toggleTask} />
      ))}
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-4">
              Welcome to Your To-Do List
            </h2>
            <p className="mb-4">Your tasks:</p>
            {tasks.length > 0 ? (
              renderTasks()
            ) : (
              <p className="text-fg-secondary mb-4">No tasks added yet.</p>
            )}
            {/* Input bar at the bottom to add new tasks */}
            <div className="mt-auto">
              <p className="mb-2">Add a new task:</p>
              <div className="flex mb-4">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Type a new task and press Enter"
                  className="flex-grow mr-2"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addTask();
                    }
                  }}
                />
                <Button
                  variant="primary"
                  onClick={addTask}
                  icon={<PaperPlaneTilt />}
                  aria-label="Add task"
                />
              </div>
            </div>
          </div>
        );
      case "tasks":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Task Navigator</h2>
            {tasks.length > 0 ? (
              renderTasks()
            ) : (
              <p className="text-fg-secondary">No tasks added yet.</p>
            )}
          </>
        );
      case "user":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">User Manager</h2>
            <p>User management features coming soon!</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SparkApp>
      <PageContainer maxWidth="medium" className="flex flex-col h-screen">
        {/* Navigation bar */}
        <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Main content */}
        {renderContent()}
      </PageContainer>
    </SparkApp>
  );
}

// Initialize the React root and render the app
const root = createRoot(document.getElementById("root"));
root.render(<TodoApp />);
