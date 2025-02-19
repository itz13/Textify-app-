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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Textarea,
} from "@github/spark/components";

// Import useKV hook for persisting data
import { useKV } from "@github/spark/hooks";

// Import icons
import {
  PaperPlaneTilt,
  House,
  ListChecks,
  User,
  PencilSimple,
  Trash,
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
function Task({ task, toggleTask, onEdit, onDelete, showEditButton, showDeleteButton }) {
  // Determine priority color
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <Card className="p-3 flex-grow min-w-[200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Checkbox to mark task as completed */}
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="mr-3"
          />
          {/* Task text */}
          <div>
            <h3 className="font-bold">{task.title}</h3>
            <span className={task.completed ? "line-through text-fg-secondary" : ""}>
              {task.text}
            </span>
            {task.description && (
              <p className="text-sm text-fg-secondary mt-1">{task.description}</p>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-accent-3 text-accent-11 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Priority indicator */}
        <div className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              priorityColors[task.priority] || "bg-gray-400"
            }`}
            title={`Priority: ${task.priority}`}
          ></div>
          <span className="ml-2 text-sm text-fg-secondary capitalize">
            {task.priority} priority
          </span>
          {/* Edit button, only shown if showEditButton is true */}
          {showEditButton && (
            <Button
              icon={<PencilSimple />}
              variant="plain"
              aria-label="Edit task"
              onClick={() => onEdit(task)}
              className="ml-3"
            />
          )}
          {/* Delete button, only shown if showDeleteButton is true */}
          {showDeleteButton && (
            <Button
              icon={<Trash />}
              variant="plain"
              aria-label="Delete task"
              onClick={() => onDelete(task.id)}
              className="ml-3 text-red-500"
            />
          )}
        </div>
      </div>
      {/* Display points for completing the task */}
      <div className="mt-2 text-sm text-fg-secondary">
        Points: {task.points}
      </div>
    </Card>
  );
}

// Edit Task Dialog component
function EditTaskDialog({ task, onSave, onCancel }) {
  const [editedTask, setEditedTask] = React.useState(task);

  const handleChange = (field, value) => {
    setEditedTask({ ...editedTask, [field]: value });
  };

  return (
    <Dialog open={!!task} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>Modify the details of your task below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            value={editedTask.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Task Title"
          />
          <Textarea
            value={editedTask.text}
            onChange={(e) => handleChange("text", e.target.value)}
            placeholder="Task Details"
            rows={3}
          />
          <Input
            type="text"
            value={editedTask.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Task Description"
          />
          <Input
            type="text"
            value={editedTask.tags.join(", ")}
            onChange={(e) =>
              handleChange("tags", e.target.value.split(",").map((tag) => tag.trim()))
            }
            placeholder="Tags (comma-separated)"
          />
          <select
            value={editedTask.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full p-2 border border-neutral-6 rounded"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary" onClick={() => onSave(editedTask)}>
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Achievements component to display completed tasks
function Achievements({ tasks }) {
  // Calculate total points from completed tasks
  const totalPoints = React.useMemo(
    () => tasks.filter((task) => task.completed).reduce((sum, task) => sum + task.points, 0),
    [tasks]
  );

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Current Achievements</h3>
      <p className="text-fg-secondary mb-4">
        Total Points Earned: <span className="font-bold">{totalPoints}</span>
      </p>
      {tasks.filter((task) => task.completed).length > 0 ? (
        <div className="grid gap-4">
          {tasks
            .filter((task) => task.completed)
            .map((task) => (
              <Card key={task.id} className="p-3">
                <h4 className="font-bold">{task.title}</h4>
                <p className="text-sm text-fg-secondary">{task.text}</p>
                <p className="text-sm text-fg-secondary">Points: {task.points}</p>
              </Card>
            ))}
        </div>
      ) : (
        <p className="text-fg-secondary">No achievements yet. Complete tasks to see them here!</p>
      )}
    </div>
  );
}

// Main To-Do App component
function TodoApp() {
  // Use useKV hook to persist tasks data
  const [tasks, setTasks] = useKV("todo-tasks", []);
  // State for NLP input
  const [nlpInput, setNlpInput] = React.useState("");
  // State for active tab in navigation
  const [activeTab, setActiveTab] = React.useState("home");
  // State for task being edited
  const [taskBeingEdited, setTaskBeingEdited] = React.useState(null);

  // Function to process NLP input and add a task
  const processNlpInput = async () => {
    if (nlpInput.trim() !== "") {
      // Use NLP to extract task details
      const prompt = spark.llmPrompt`Extract task details from the following input: "${nlpInput}". Return a JSON object with "text", "description", "priority", "tags", and "points".`;
      const response = await spark.llm(prompt);
      try {
        const taskDetails = JSON.parse(response);
        setTasks([
          {
            id: Date.now(),
            title: `Task ${tasks.length + 1}`, // Add task title
            text: taskDetails.text || "Untitled Task",
            description: taskDetails.description || "",
            completed: false,
            tags: taskDetails.tags || [],
            priority: taskDetails.priority || "medium",
            points: taskDetails.points || 0, // Add points attribute
          },
          ...tasks,
        ]);
        setNlpInput("");
      } catch (error) {
        console.error("Failed to parse NLP response:", error);
      }
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

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Function to save edited task
  const saveEditedTask = (editedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === editedTask.id ? { ...editedTask } : task
      )
    );
    setTaskBeingEdited(null);
  };

  // Render tasks in a flex-wrap container
  const renderTasks = (editable = false, deletable = false) => (
    <div className="flex flex-wrap gap-4 pb-4">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          onEdit={editable ? setTaskBeingEdited : null}
          onDelete={deletable ? deleteTask : null}
          showEditButton={editable} // Pass showEditButton prop
          showDeleteButton={deletable} // Pass showDeleteButton prop
        />
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
              renderTasks(false, false) // Do not show edit or delete buttons on home page
            ) : (
              <p className="text-fg-secondary mb-4">No tasks added yet.</p>
            )}
            {/* NLP input bar at the bottom to add new tasks */}
            <div className="mt-auto">
              <p className="mb-2">Add a new task:</p>
              <div className="flex mb-4">
                <Input
                  type="text"
                  value={nlpInput}
                  onChange={(e) => setNlpInput(e.target.value)}
                  placeholder="Describe your task (e.g., 'Buy groceries, high priority, tags: shopping, food, 10 points')"
                  className="flex-grow mr-2"
                />
                <Button
                  variant="primary"
                  onClick={processNlpInput}
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
              <>
                {renderTasks(true, true) /* Show edit and delete buttons on task navigator page */}
                <Achievements tasks={tasks} />
              </>
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
        {/* Edit Task Dialog */}
        {taskBeingEdited && (
          <EditTaskDialog
            task={taskBeingEdited}
            onSave={saveEditedTask}
            onCancel={() => setTaskBeingEdited(null)}
          />
        )}
      </PageContainer>
    </SparkApp>
  );
}

// Initialize the React root and render the app
const root = createRoot(document.getElementById("root"));
root.render(<TodoApp />);

