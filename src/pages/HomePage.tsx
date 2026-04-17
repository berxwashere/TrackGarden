import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import WeatherWidget from '../components/WeatherWidget';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { TaskItem } from '../interfaces/task';

const STORAGE_KEY = 'trackgarden_tasks_v1';


const HomePage = () => {
  // Initialize language from localStorage or default to Turkish
  const [language, setLanguage] = useState<'TR' | 'ENG'>(() => {
    return (localStorage.getItem('trackgarden_lang') as 'TR' | 'ENG') || 'TR';
  });

  // Example tasks to show when the user first visits the app
  const defaultTasks: TaskItem[] = [
    {
      id: 'example-1',
      title: 'Örnek: Birinci Arazi Bölgesi',
      action: 'Örnek: Budama İşlemi',
      date: new Date().toISOString().split('T')[0],
      status: 'todo'
    },
    {
      id: 'example-2',
      title: 'Örnek: İkinci Bahçe',
      action: 'Sulama ve Gübreleme',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      status: 'completed'
    }
  ];

  // Initialize tasks from localStorage or use default example tasks
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [message, setMessage] = useState('');

  // Automatically save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Synchronize language preference to persistent storage
  useEffect(() => {
    localStorage.setItem('trackgarden_lang', language);
  }, [language]);

  // Helper to generate unique IDs for new tasks
  const generateId = () => {
    return typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 9);
  };

  const translations = useMemo(
    () => ({
      todoTitle: language === 'TR' ? 'Yapılacaklar' : 'To-Do',
      completedTitle: language === 'TR' ? 'Tamamlananlar' : 'Completed',
      heroText: language === 'TR' ? 'Akıllı tarım, arazi ve bahçe ajandanız artık burada!' : 'Your smart farming, field and garden planner is now here!',
      weatherHint: language === 'TR' ? 'Hava durumu görev kararlarında size yardımcı olur.' : 'Weather supports you in your task decisions.',
    }),
    [language]
  );

  const addTask = (payload: Omit<TaskItem, 'id' | 'status'>) => {
    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        status: 'todo',
        ...payload,
      },
    ]);
    setMessage('');
  };

  const saveCompleted = (payload: Omit<TaskItem, 'id' | 'status'>) => {
    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        status: 'completed',
        ...payload,
      },
    ]);
    setMessage('');
  };

  const updateTask = (updated: TaskItem) => {
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
    setEditTask(null);
    setMessage('');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (editTask?.id === id) setEditTask(null);
  };

  const handleEdit = (task: TaskItem) => {
    setEditTask(task);
    setMessage('');
  };

  // Move a task to completed and force the completion date to TODAY
  const handleDone = (task: TaskItem) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id ? { ...item, status: 'completed', date: todayStr } : item
      )
    );
    setMessage('');
  };

  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <Header language={language} setLanguage={setLanguage} heroText={translations.heroText} weatherHint={translations.weatherHint} />

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr] items-stretch">
        <article className="rounded-3xl bg-white p-5 shadow-soft flex flex-col">
          <div className="space-y-2">
            <p className="text-base uppercase tracking-[0.22em] text-emerald-600">
              {language === 'TR' ? 'Arazi Takip' : 'TRACK GARDEN'}
            </p>
            <h2 className="text-xl font-semibold text-slate-900">{language === 'TR' ? 'Genel Durum' : 'Overview'}</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 flex-1">
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">{language === 'TR' ? 'Yapılacaklar' : 'To-Do'}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{todoTasks.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-3">
              <p className="text-sm text-slate-500">{language === 'TR' ? 'Tamamlananlar' : 'Completed'}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{completedTasks.length}</p>
            </div>
          </div>
        </article>
        <WeatherWidget language={language} />
      </div>

      <div className="mt-4">
        <TaskForm
          language={language}
          editTask={editTask}
          onAddTodo={addTask}
          onSaveCompleted={saveCompleted}
          onUpdateTask={updateTask}
          onCancel={() => setEditTask(null)}
          message={message}
          setMessage={setMessage}
        />
      </div>

      <div className="mt-4 grid gap-6 xl:grid-cols-2">
        <TaskList
          language={language}
          title={translations.todoTitle}
          tasks={todoTasks}
          showDoneButton={true}
          onDone={handleDone}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
        <TaskList
          language={language}
          title={translations.completedTitle}
          tasks={completedTasks}
          showDoneButton={false}
          onDone={() => undefined}
          onEdit={handleEdit}
          onDelete={deleteTask}
        />
      </div>
    </main>
  );
};

export default HomePage;
