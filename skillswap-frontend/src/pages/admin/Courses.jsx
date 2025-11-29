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
  const CATEGORY_OPTIONS = [
    { value: 'development', label: 'Development', sub: ['Web Development','Data Science','Mobile Development'] },
    { value: 'business', label: 'Business', sub: ['Finance','Entrepreneurship','Management'] },
    { value: 'it', label: 'IT & Software', sub: ['IT Certification','Cybersecurity'] },
    { value: 'finance', label: 'Finance', sub: ['Accounting','Investing & Trading','Cryptocurrency & Blockchain'] },
    { value: 'marketing', label: 'Marketing', sub: ['Digital Marketing','SEO','Social Media Marketing'] }
  ];
  const [form, setForm] = useState({
    course_name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    course_image: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    isActive: true
  });
  const [courseNameError, setCourseNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [subcategoryError, setSubcategoryError] = useState('');
  const [instructorError, setInstructorError] = useState('');
  const [courseImageError, setCourseImageError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [formError, setFormError] = useState('');

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

  const clearFormErrors = () => {
    setCourseNameError('');
    setDescriptionError('');
    setPriceError('');
    setCategoryError('');
    setSubcategoryError('');
    setInstructorError('');
    setCourseImageError('');
    setDurationError('');
    setFormError('');
  };

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
      duration: '',
      level: 'beginner',
      isActive: true
    });
    clearFormErrors();
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
      duration: course.duration || '',
      level: course.level || 'beginner',
      isActive: course.isActive !== false
    });
    clearFormErrors();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    clearFormErrors();
  };

  const validateCourseName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setCourseNameError('Course name is required');
      return false;
    }
    if (trimmed.length < 3) {
      setCourseNameError('Course name must be atleast 3 characters');
      return false;
    }
    if (trimmed.length > 150) {
      setCourseNameError('Course name is too long');
      return false;
    }
    // Ensure it contains at least one letter
    if (!/[a-zA-Z]/.test(trimmed)) {
      setCourseNameError('Course name must contain at least one letter');
      return false;
    }
    setCourseNameError('');
    return true;
  };

  const validatePrice = (value) => {
    if (value === '' || value === null || value === undefined) {
      setPriceError('Price is required');
      return false;
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      setPriceError('Please enter a valid number');
      return false;
    }
    if (numValue < 0) {
      setPriceError('Price must be 0 or greater');
      return false;
    }
    if (numValue > 100000000000) {
      setPriceError('Price is too large');
      return false;
    }
    setPriceError('');
    return true;
  };

  const validateDescription = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setDescriptionError('Description is required');
      return false;
    }
    if (trimmed.length < 10) {
      setDescriptionError('Description is too short');
      return false;
    }
    if (trimmed.length > 5000) {
      setDescriptionError('Description is too long');
      return false;
    }
    setDescriptionError('');
    return true;
  };

  const validateCategory = (value) => {
    if (!value || value === '') {
      setCategoryError('Category is required');
      return false;
    }
    const validCategories = ['development', 'business', 'it', 'finance', 'marketing', 'design', 'data-science', 'ai-ml', 'other'];
    // Support comma-separated tags
    const categories = value.split(',').map(c => c.trim()).filter(c => c);
    const invalidCategories = categories.filter(c => !validCategories.includes(c));
    if (invalidCategories.length > 0) {
      setCategoryError('Please select a valid category');
      return false;
    }
    setCategoryError('');
    return true;
  };

  const validateInstructorName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setInstructorError('Instructor name is required');
      return false;
    }
    if (trimmed.length < 3) {
      setInstructorError('Instructor name must be atleast 3 characters');
      return false;
    }
    if (trimmed.length > 50) {
      setInstructorError('Instructor name must be less than 50 characters');
      return false;
    }
    // Ensure it contains at least one letter
    if (!/[a-zA-Z]/.test(trimmed)) {
      setInstructorError('Instructor name must contain at least one letter');
      return false;
    }
    setInstructorError('');
    return true;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    // Real-time validation
    if (name === 'course_name') {
      validateCourseName(value);
    } else if (name === 'price') {
      validatePrice(value);
    } else if (name === 'description') {
      validateDescription(value);
    } else if (name === 'category') {
      validateCategory(value);
    } else if (name === 'instructor') {
      validateInstructorName(value);
    } else if (name === 'subcategory') {
      if (!value.trim()) {
        setSubcategoryError('Subcategory is required');
      } else {
        setSubcategoryError('');
      }
    } else if (name === 'duration') {
      if (!value.trim()) {
        setDurationError('Duration is required');
      } else if (value.trim().length > 50) {
        setDurationError('Duration must be less than 50 characters');
      } else {
        setDurationError('');
      }
    }
  };

  const mapErrorToField = (errorMessage) => {
    // Clear all errors first
    clearFormErrors();
    
    // Map error messages to specific fields (case-insensitive matching)
    const lowerMessage = errorMessage.toLowerCase();
    if (lowerMessage.includes('course name') || lowerMessage.includes('course with this name') || lowerMessage.includes('already exists')) {
      setCourseNameError(errorMessage);
    } else if (lowerMessage.includes('description') && !lowerMessage.includes('category')) {
      setDescriptionError(errorMessage);
    } else if (lowerMessage.includes('price') || lowerMessage.includes('valid number') || lowerMessage.includes('too large') || lowerMessage.includes('0 or greater')) {
      setPriceError(errorMessage);
    } else if (lowerMessage.includes('category') && !lowerMessage.includes('subcategory') && !lowerMessage.includes('description')) {
      setCategoryError(errorMessage);
    } else if (lowerMessage.includes('subcategory')) {
      setSubcategoryError(errorMessage);
    } else if (lowerMessage.includes('instructor')) {
      setInstructorError(errorMessage);
    } else if (lowerMessage.includes('image') || lowerMessage.includes('url')) {
      setCourseImageError(errorMessage);
    } else if (lowerMessage.includes('duration')) {
      setDurationError(errorMessage);
    } else {
      // For any other errors, show in form error area
      setFormError(errorMessage);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    clearFormErrors();
    
    // Validate all required fields before submission
    const trimmedCourseName = form.course_name.trim();
    if (!validateCourseName(trimmedCourseName)) {
      setSaving(false);
      return;
    }
    
    if (!validateDescription(form.description)) {
      setSaving(false);
      return;
    }
    
    if (!validatePrice(form.price)) {
      setSaving(false);
      return;
    }
    
    if (!validateCategory(form.category)) {
      setSaving(false);
      return;
    }
    
    if (!validateInstructorName(form.instructor)) {
      setSaving(false);
      return;
    }
    
    if (!form.subcategory || !form.subcategory.trim()) {
      setSubcategoryError('Subcategory is required');
      setSaving(false);
      return;
    }
    
    if (!form.course_image || !form.course_image.trim()) {
      setCourseImageError('Course image is required');
      setSaving(false);
      return;
    }
    
    if (!form.duration || !form.duration.trim()) {
      setDurationError('Duration is required');
      setSaving(false);
      return;
    }
    
    try {
      // Process category - support comma-separated tags and trim spaces
      let processedCategory = form.category;
      if (processedCategory.includes(',')) {
        processedCategory = processedCategory.split(',').map(c => c.trim()).filter(c => c).join(',');
      }
      
      const payload = {
        course_name: trimmedCourseName,
        description: form.description.trim(),
        price: Number(form.price),
        category: processedCategory,
        subcategory: form.subcategory.trim(),
        course_image: form.course_image,
        instructor: form.instructor.trim(),
        duration: form.duration.trim(),
        level: form.level,
        isActive: form.isActive
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
      clearFormErrors();
      // Show success message
      alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Save failed';
      mapErrorToField(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // live search
  const [search, setSearch] = useState('');
  const uniqueCourses = useMemo(() => {
    const seen = new Set();
    return (courses || []).filter(course => {
      const key = (course?.course_name || course?._id)?.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!search) return uniqueCourses;
    const q = search.toLowerCase();
    return uniqueCourses.filter(c =>
      (c.course_name || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q) ||
      (c.subcategory || '').toLowerCase().includes(q)
    );
  }, [uniqueCourses, search]);

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

					{error && !showForm && (
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-950">
              <div>
                <h3 className="text-xl font-bold text-gray-100">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                <p className="text-sm text-gray-400 mt-1">Fill in all required fields marked with <span className="text-red-400">*</span></p>
              </div>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg p-2 transition-colors">
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="p-4 bg-red-900/30 border-l-4 border-red-500 rounded-lg flex items-start">
                  <i className="fas fa-exclamation-triangle text-red-400 mr-3 mt-0.5"></i>
                  <div>
                    <p className="text-sm font-semibold text-red-400">Validation Error</p>
                    <p className="text-sm text-red-300 mt-1">{formError}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Course Name <span className="text-red-400">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({form.course_name.trim().length}/150 characters, minimum 3)
                    </span>
                  </label>
                  <input 
                    name="course_name" 
                    value={form.course_name} 
                    onChange={onChange} 
                    placeholder="e.g., PHP Basics"
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      courseNameError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-800'
                    }`}
                  />
                  {courseNameError && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {courseNameError}
                    </p>
                  )}
                  {!courseNameError && form.course_name.trim().length >= 3 && (
                    <p className="mt-1 text-sm text-green-400 flex items-center">
                      <i className="fas fa-check-circle mr-1"></i>
                      Course name is valid
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input 
                      name="price" 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={form.price} 
                      onChange={onChange} 
                      placeholder="0.00"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        priceError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-800'
                      }`}
                    />
                  </div>
                  {priceError && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {priceError}
                    </p>
                  )}
                  {!priceError && form.price && Number(form.price) === 0 && (
                    <p className="mt-1 text-sm text-green-400 flex items-center">
                      <i className="fas fa-check-circle mr-1"></i>
                      Free course
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description <span className="text-red-400">*</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({form.description.trim().length}/5000 characters, minimum 10)
                    </span>
                  </label>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={onChange} 
                    required 
                    rows="4" 
                    placeholder="Enter course description (minimum 10 characters, maximum 5000 characters)"
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y ${
                      descriptionError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-800'
                    }`}
                  ></textarea>
                  {descriptionError && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {descriptionError}
                    </p>
                  )}
                  {!descriptionError && form.description.trim().length >= 10 && (
                    <p className="mt-1 text-sm text-green-400 flex items-center">
                      <i className="fas fa-check-circle mr-1"></i>
                      Description is valid
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category / Tags <span className="text-red-400">*</span>
                    <span className="text-xs text-gray-500 ml-2">(comma-separated for multiple)</span>
                  </label>
                  <select 
                    name="category" 
                    value={form.category} 
                    onChange={(e)=>{
                      const value = e.target.value;
                      setForm(prev=>({ ...prev, category: value, subcategory: '' }));
                      validateCategory(value);
                      setSubcategoryError('');
                    }} 
                    required 
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      categoryError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-800'
                    }`}
                  >
                    <option value="">Select a Category</option>
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {categoryError && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      {categoryError}
                    </p>
                  )}
                  {!categoryError && form.category && (
                    <p className="mt-1 text-sm text-green-400 flex items-center">
                      <i className="fas fa-check-circle mr-1"></i>
                      Category selected
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subcategory</label>
                  <select 
                    name="subcategory" 
                    value={form.subcategory} 
                    onChange={onChange} 
                    required
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 ${
                      subcategoryError ? 'border-red-500' : 'border-gray-800'
                    }`}
                  >
                    <option value="">Select a Subcategory</option>
                    {(CATEGORY_OPTIONS.find(c=>c.value===form.category)?.sub || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {subcategoryError && (
                    <p className="mt-1 text-sm text-red-400">{subcategoryError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Course Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCourseImageError('');
                      const reader = new FileReader();
                      reader.onload = () => {
                        setForm(prev => ({ ...prev, course_image: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }} 
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 ${
                      courseImageError ? 'border-red-500' : 'border-gray-800'
                    }`}
                  />
                  {courseImageError && (
                    <p className="mt-1 text-sm text-red-400">{courseImageError}</p>
                  )}
                  {form.course_image && (
                    <div className="mt-2">
                      <img src={form.course_image} alt="Preview" className="h-24 w-24 object-cover rounded" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                  <input 
                    name="duration" 
                    value={form.duration} 
                    onChange={onChange} 
                    required
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 ${
                      durationError ? 'border-red-500' : 'border-gray-800'
                    }`}
                  />
                  {durationError && (
                    <p className="mt-1 text-sm text-red-400">{durationError}</p>
                  )}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instructor Name</label>
                  <input 
                    name="instructor" 
                    value={form.instructor} 
                    onChange={onChange} 
                    required 
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-900 text-gray-100 ${
                      instructorError ? 'border-red-500' : 'border-gray-800'
                    }`}
                  />
                  {instructorError && (
                    <p className="mt-1 text-sm text-red-400">{instructorError}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <input id="isActive" name="isActive" type="checkbox" checked={form.isActive} onChange={onChange} />
                  <label htmlFor="isActive" className="text-sm text-gray-300">Active</label>
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-800">
                <button 
                  type="button" 
                  onClick={closeForm} 
                  className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  disabled={saving} 
                  type="submit" 
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center"
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving…
                    </>
                  ) : (
                    <>
                      <i className={`fas ${editingCourse ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                      {editingCourse ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
	</>
	);
}