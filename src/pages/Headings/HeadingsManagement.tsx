import React, { useState } from 'react';
import { Folders, Plus, Edit2, Trash2, Save, X, MoveUp, MoveDown } from 'lucide-react';
import { useWorkHours } from '../../context/WorkHoursContext';
import type { Heading } from '../../types';

interface EditingHeading {
  id: string;
  name: string;
}

const HeadingsManagement: React.FC = () => {
  const { headings, addHeading, updateHeading, deleteHeading, reorderHeadings } = useWorkHours();
  const [newHeading, setNewHeading] = useState('');
  const [editingHeading, setEditingHeading] = useState<EditingHeading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sortedHeadings = [...headings].sort((a, b) => a.order - b.order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headingName = editingHeading ? editingHeading.name : newHeading;
    
    if (!headingName.trim()) {
      setError('Heading name is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (editingHeading) {
        await updateHeading(editingHeading.id, { name: headingName });
        setMessage('Heading updated successfully');
        setEditingHeading(null);
      } else {
        await addHeading({ name: headingName });
        setMessage('Heading added successfully');
        setNewHeading('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (heading: Heading) => {
    setEditingHeading({
      id: heading._id,
      name: heading.name
    });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingHeading(null);
    setError(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteHeading(id);
      setMessage('Heading deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete heading');
    } finally {
      setIsLoading(false);
    }
  };

  const moveHeading = async (headingId: string, direction: 'up' | 'down') => {
    const currentIndex = sortedHeadings.findIndex(h => h._id === headingId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedHeadings.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const orders = sortedHeadings.map((heading, index) => {
      if (index === currentIndex) return { id: heading._id, order: sortedHeadings[newIndex].order };
      if (index === newIndex) return { id: heading._id, order: sortedHeadings[currentIndex].order };
      return { id: heading._id, order: heading.order };
    });

    try {
      await reorderHeadings(orders);
      setMessage('Headings reordered successfully');
    } catch (err) {
      setError('Failed to reorder headings');
    }
  };

  // Clear message after 3 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center">
          <Folders className="h-8 w-8 text-indigo-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Headings Management</h2>
            <p className="mt-2 text-sm text-gray-500">
              Create and manage headings for categorizing work hours
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <label htmlFor="heading-name" className="sr-only">
                {editingHeading ? 'Edit Heading' : 'New Heading'}
              </label>
              <input
                type="text"
                id="heading-name"
                placeholder={editingHeading ? 'Edit heading name' : 'Enter new heading name'}
                value={editingHeading ? editingHeading.name : newHeading}
                onChange={(e) => 
                  editingHeading 
                    ? setEditingHeading({ ...editingHeading, name: e.target.value })
                    : setNewHeading(e.target.value)
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex gap-2">
              {editingHeading && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {editingHeading ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {editingHeading ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* Success Message */}
      {message && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Headings List */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <ul className="divide-y divide-gray-200">
          {sortedHeadings.map((heading, index) => (
            <li 
              key={heading._id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="text-gray-900">{heading.name}</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => moveHeading(heading._id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <MoveUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveHeading(heading._id, 'down')}
                  disabled={index === sortedHeadings.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <MoveDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(heading)}
                  className="p-1 text-indigo-600 hover:text-indigo-900"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(heading._id, heading.name)}
                  className="p-1 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {sortedHeadings.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No headings created yet. Add your first heading above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeadingsManagement;