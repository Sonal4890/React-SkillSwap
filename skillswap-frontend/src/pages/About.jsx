import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SkillSwap</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering learners worldwide with high-quality online courses and expert instruction.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At SkillSwap, we believe that education should be accessible, engaging, and transformative. 
                Our mission is to democratize learning by providing high-quality online courses taught by 
                industry experts to learners around the world.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to helping individuals develop new skills, advance their careers, and 
                pursue their passions through our comprehensive learning platform.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://i.pinimg.com/736x/f0/93/c1/f093c1f983f59b7ebf94db393ed56e97.jpg" 
                alt="Learning together" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                <i className="fas fa-graduation-cap text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Education</h3>
              <p className="text-gray-600">
                We maintain the highest standards in course content and instruction, 
                ensuring every learner receives valuable, up-to-date knowledge.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
                <i className="fas fa-users text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                We foster a supportive learning community where students can connect, 
                collaborate, and grow together.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-600">
                <i className="fas fa-lightbulb text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate our platform and teaching methods to provide 
                the best possible learning experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://i.pinimg.com/736x/c6/45/5d/c6455dbe43cbdebf7184aac3b5426620.jpg" 
                alt="John Doe" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chandan Shruti</h3>
              <p className="text-blue-600 mb-2">Backend Developer</p>
              <p className="text-gray-600 text-sm">
                Passionate about education and technology, shruti founded SkillSwap to make 
                quality learning accessible to everyone.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://i.pinimg.com/736x/f7/2e/b4/f72eb4dff7efee85e8bceb5036b881dc.jpg" 
                alt="Jane Smith" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-pink-300"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Marwadi Sonal</h3>
              <p className="text-blue-600 mb-2">Full-Stack Developer</p>
              <p className="text-gray-600 text-sm">
                With over 1 year in educational technology, sonal ensures our courses 
                meet the highest quality standards.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://i.pinimg.com/736x/cf/ec/f1/cfecf17b4b04453692d5060625d6b8cd.jpg" 
                alt="Mike Johnson" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ghoghari Nensi</h3>
              <p className="text-blue-600 mb-2">Frontend Developer</p>
              <p className="text-gray-600 text-sm">
                nensi leads our technical team, building the platform that makes 
                seamless learning possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of students already learning with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center text-lg px-8 py-3 rounded-full font-bold bg-white text-purple-600 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Get Started Free
            </Link>
            <Link 
              to="/shop"
              className="inline-flex items-center text-lg px-8 py-3 rounded-full font-bold border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-110"
            >
              <i className="fas fa-graduation-cap mr-2"></i>
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}