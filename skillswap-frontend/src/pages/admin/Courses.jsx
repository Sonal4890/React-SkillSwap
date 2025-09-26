import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../../lib/api';

export default function Courses() {
	const user = useSelector(s => s.auth.user);
	const navigate = useNavigate();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    course_name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    course_image: '',
    instructor: '',
    instructor_email: '',
    duration: '',
    level: 'beginner',
    language: 'English',
    isActive: true
  });

	const fetchCourses = async () => {
		try {
			setLoading(true);
			const { data } = await api.get('/api/courses', { params: { limit: 100, order: 'desc' } });
			setCourses(data.courses || []);
		} catch (e) {
			setError(e.response?.data?.message || 'Failed to load courses');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { fetchCourses(); }, []);

  const openAdd = () => {
    setEditingCourse(null);
    setForm({
      course_name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      course_image: '',
      instructor: '',
      instructor_email: '',
      duration: '',
      level: 'beginner',
      language: 'English',
      isActive: true
    });
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      course_name: course.course_name || '',
      description: course.description || '',
      price: course.price ?? '',
      category: course.category || '',
      subcategory: course.subcategory || '',
      course_image: course.course_image || '',
      instructor: course.instructor || '',
      instructor_email: course.instructor_email || '',
      duration: course.duration || '',
      level: course.level || 'beginner',
      language: course.language || 'English',
      isActive: course.isActive !== false
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price)
      };
      if (editingCourse) {
        const { data } = await api.put(`/api/courses/${editingCourse._id}`, payload);
        setCourses(prev => prev.map(c => c._id === editingCourse._id ? data.course : c));
      } else {
        const { data } = await api.post('/api/courses', payload);
        setCourses(prev => [data.course, ...prev]);
      }
      setShowForm(false);
      setEditingCourse(null);
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  // live search
  const [search, setSearch] = useState('');
  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    const q = search.toLowerCase();
    return courses.filter(c =>
      (c.course_name || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.subcategory || '').toLowerCase().includes(q)
    );
  }, [courses, search]);

	const onDelete = async (id) => {
		if (!confirm('Delete this course?')) return;
		try {
			await api.delete(`/api/courses/${id}`);
			setCourses(prev => prev.filter(c => c._id !== id));
		} catch (e) {
			alert(e.response?.data?.message || 'Delete failed');
		}
	};

	return (
		<>
		<div className="min-h-screen bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-100">Courses</h1>
					<p className="text-gray-400">Manage courses and content</p>
				</div>

				<div className="bg-gray-950 border border-gray-800 rounded-lg shadow-sm overflow-hidden">
					<div className="px-6 py-4 border-b border-gray-800">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-gray-100">All Courses</h2>
							<div className="flex items-center gap-3">
								<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses" className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-100" />
						<button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								<i className="fas fa-plus mr-2"></i>
								Add Course
							</button>
							</div>
						</div>
					</div>

					{error && (
						<div className="px-6 py-3 text-red-700 bg-red-50 border-b border-red-200">{error}</div>
					)}

					<div className="overflow-x-auto">
						{loading ? (
							<div className="p-8 text-center text-gray-400">Loading…</div>
						) : (
							<table className="min-w-full divide-y divide-gray-800">
								<thead className="bg-gray-900">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Course</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Students</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
									</tr>
								</thead>
								<tbody className="bg-gray-950 divide-y divide-gray-800">
									{filteredCourses.map(course => (
										<tr key={course._id} className="hover:bg-gray-900">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
														{course.course_image ? (
															<img src={course.course_image} alt={course.course_name} className="w-full h-full object-cover" />
														) : (
															<i className="fas fa-graduation-cap text-gray-300"></i>
														)}
													</div>
													<div className="ml-4">
													<div className="text-sm font-medium text-gray-100">{course.course_name}</div>
													<div className="text-sm text-gray-400">{new Date(course.createdAt).toLocaleDateString()}</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
											<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/30 text-blue-300">
													{course.category}
												</span>
											</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">₹{course.price}</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{course.enrolledCount || 0}</td>
											<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.isActive !== false ? 'bg-green-900/30 text-green-300' : 'bg-yellow-900/30 text-yellow-200'}`}>
													{course.isActive !== false ? 'active' : 'draft'}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex space-x-3">
												<button onClick={() => openEdit(course)} className="text-blue-400 hover:text-blue-300" title="Edit">
														<i className="fas fa-edit"></i>
													</button>
												<button onClick={() => navigate(`/admin/courses/${course._id}`)} className="text-green-400 hover:text-green-300" title="Preview">
														<i className="fas fa-eye"></i>
													</button>
												<button onClick={() => onDelete(course._id)} className="text-red-400 hover:text-red-300" title="Delete">
														<i className="fas fa-trash"></i>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-300">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Course Name</label>
                  <input name="course_name" value={form.course_name} onChange={onChange} required className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                  <input name="price" type="number" min="0" step="1" value={form.price} onChange={onChange} required className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={onChange} required rows="3" className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <input name="category" value={form.category} onChange={onChange} required className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subcategory</label>
                  <input name="subcategory" value={form.subcategory} onChange={onChange} className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Course Image URL</label>
                  <input name="course_image" value={form.course_image} onChange={onChange} className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input name="duration" value={form.duration} onChange={onChange} className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                  <select name="level" value={form.level} onChange={onChange} className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
                  <input name="language" value={form.language} onChange={onChange} className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instructor Name</label>
                  <input name="instructor" value={form.instructor} onChange={onChange} required className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instructor Email</label>
                  <input name="instructor_email" type="email" value={form.instructor_email} onChange={onChange} required className="w-full px-3 py-2 border border-gray-800 bg-gray-900 text-gray-100 rounded-lg" />
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <input id="isActive" name="isActive" type="checkbox" checked={form.isActive} onChange={onChange} />
                  <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg border border-gray-800 text-gray-200">Cancel</button>
                <button disabled={saving} type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving…' : (editingCourse ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
	</>
	);
}