import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById } from '../../store/slices/coursesSlice';
import Footer from '../../components/Footer.jsx';

export default function CoursePreview() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector(s => s.courses);

  useEffect(() => {
    if (id) dispatch(fetchCourseById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading course…</p>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/admin/courses" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{current.course_name}</h1>
            <p className="text-gray-600 dark:text-gray-400">Admin preview (no purchase actions)</p>
          </div>
          <Link to="/admin/courses" className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200">Back</Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-video bg-gray-100 dark:bg-gray-900">
              {current.course_image ? (
                <img src={current.course_image} alt={current.course_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <i className="fas fa-image text-4xl"></i>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">About this course</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{current.description}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm p-6 space-y-5 h-fit">
            <div className="flex items-center justify-between">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{current.category}</span>
              <span className="text-2xl font-extrabold text-emerald-500">₹{current.price}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <Info label="Instructor" value={current.instructor} />
              <Info label="Duration" value={current.duration || 'Self-paced'} />
              <Info label="Level" value={current.level || 'All levels'} />
              <Info label="Language" value={current.language || 'English'} />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Created on {new Date(current.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}


