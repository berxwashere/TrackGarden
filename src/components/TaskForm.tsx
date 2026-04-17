import { useEffect, useState } from 'react';
import { TaskItem } from '../interfaces/task';

interface TaskFormProps {
  language: 'TR' | 'ENG';
  editTask: TaskItem | null;
  onAddTodo: (task: Omit<TaskItem, 'id' | 'status'>) => void;
  onSaveCompleted: (task: Omit<TaskItem, 'id' | 'status'>) => void;
  onUpdateTask: (task: TaskItem) => void;
  onCancel: () => void;
  message: string;
  setMessage: (text: string) => void;
}

/**
 * TaskForm handles both the creation of new tasks and updating existing ones.
 * It enforces strict date validation based on the task status.
 */
const TaskForm = ({ language, editTask, onAddTodo, onSaveCompleted, onUpdateTask, onCancel, message, setMessage }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [action, setAction] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setAction(editTask.action);
      setDate(editTask.date);
      setMessage('');
    } else {
      setTitle('');
      setAction('');
      setDate('');
    }
  }, [editTask, setMessage]);

  const labels = {
    title: language === 'TR' ? 'Arazi veya Bitki Adı' : 'Field or Plant Name',
    action: language === 'TR' ? 'İşlem' : 'Action',
    date: language === 'TR' ? 'Tarih' : 'Date',
    add: language === 'TR' ? 'Takvime Ekle' : 'Add to Schedule',
    save: language === 'TR' ? 'Tamamlandı olarak Kaydet' : 'Save as Completed',
    update: language === 'TR' ? 'Değişiklikleri Güncelle' : 'Update Changes',
    cancel: language === 'TR' ? 'İptal' : 'Cancel',
  };

  // Helper to check if a date string is in the future or past
  const validateDate = (target: string) => {
    const selected = new Date(target);
    selected.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      isFuture: selected > today,
      isPast: selected < today,
    };
  };

  const handleSubmit = (type: 'todo' | 'completed') => {
    if (!title.trim() || !action.trim() || !date) {
      setMessage(language === 'TR' ? 'Lütfen tüm alanları doldurun.' : 'Please complete all fields.');
      return;
    }

    const { isFuture, isPast } = validateDate(date);

    // Validation for Completed status (either new completed or updating an existing completed task)
    if (type === 'completed' || (editTask && editTask.status === 'completed')) {
      if (isFuture) {
        setMessage(
          language === 'TR'
            ? 'Tamamlanmış bir görev ileri bir tarihte olamaz!'
            : 'A completed task cannot be in the future!'
        );
        return;
      }
    }

    // Validation for To-Do status (either new to-do or updating an existing to-do task)
    if (type === 'todo' && (!editTask || editTask.status === 'todo')) {
      if (isPast) {
        setMessage(
          language === 'TR'
            ? 'Yapılacak bir görev geçmiş bir tarihte olamaz!'
            : 'A to-do task cannot be in the past!'
        );
        return;
      }
    }

    const payload = { title, action, date };
    if (editTask) {
      onUpdateTask({ ...editTask, title, action, date });
    } else if (type === 'todo') {
      onAddTodo(payload);
      setMessage('');
    } else {
      onSaveCompleted(payload);
      setMessage('');
    }

    if (!editTask) {
      setTitle('');
      setAction('');
      setDate('');
    }
  };

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">{language === 'TR' ? 'Görev Formu' : 'Task Form'}</h2>
      <div className="grid gap-4">
        <label className="grid">
          <span className="mb-1 text-sm font-medium text-slate-600">{labels.title}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder={language === 'TR' ? 'Birinci Tarla - Fıstık Bahçesi' : 'First Orchard Field'}
          />
        </label>
        <label className="grid">
          <span className="mb-1 text-sm font-medium text-slate-600">{labels.action}</span>
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder={language === 'TR' ? 'Budama' : 'Pruning'}
          />
        </label>
        <label className="grid max-w-[220px]">
          <span className="mb-1 text-sm font-medium text-slate-600">{labels.date}</span>
          <input
            type="text"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = 'text';
            }}
            placeholder={new Date().toLocaleDateString()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {editTask ? (
          <>
            <button
              onClick={() => handleSubmit('todo')}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              {labels.update}
            </button>
            <button
              onClick={onCancel}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
            >
              {labels.cancel}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => handleSubmit('todo')}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
            >
              {labels.add}
            </button>
            <button
              onClick={() => handleSubmit('completed')}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:w-auto"
            >
              {labels.save}
            </button>
          </>
        )}
      </div>

      {message ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p> : null}
    </section>
  );
};

export default TaskForm;
