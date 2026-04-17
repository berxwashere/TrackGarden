import { TaskItem } from '../interfaces/task';

interface TaskListProps {
  language: 'TR' | 'ENG';
  title: string;
  tasks: TaskItem[];
  showDoneButton: boolean;
  onDone: (task: TaskItem) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
}

/**
 * TaskList renders a collection of tasks with actions for editing, deleting, 
 * and marking tasks as done. It uses native date formatting for localization.
 */
const TaskList = ({ language, title, tasks, showDoneButton, onDone, onEdit, onDelete }: TaskListProps) => {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-slate-500">{language === 'TR' ? 'Henüz bir görev yok.' : 'No tasks yet.'}</p>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{task.title}</p>
                  <p className="text-base text-slate-600">{task.action}</p>
                </div>
                <p className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
                  {task.date ? new Date(task.date).toLocaleDateString() : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {showDoneButton ? (
                  <button
                    onClick={() => onDone(task)}
                    className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    {language === 'TR' ? 'İşlem Bitti ✅' : 'Action is Done ✅'}
                  </button>
                ) : null}
                <button
                  onClick={() => onEdit(task)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {language === 'TR' ? 'Düzenle' : 'Edit'}
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  {language === 'TR' ? 'Sil' : 'Delete'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default TaskList;
