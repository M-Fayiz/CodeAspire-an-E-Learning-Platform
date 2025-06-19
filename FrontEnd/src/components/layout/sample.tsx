import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Clock, 
  Users, 
  Play, 
  Star, 
  // TrendingUp, 
  Target,
  CheckCircle,
  // AlertCircle,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Code,
  Database,
  Zap,
  Home,
  GraduationCap,
  MessageSquare,
  BarChart3,
  FileText,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  instructor: string;
  duration: string;
  level: string;
  nextLesson: string;
  category: string;
  rating: number;
}

interface MockInterview {
  id: string;
  company: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'in-progress';
  score?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  submenu?: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeItem, 
  onItemClick, 
  isCollapsed = false, 
  onToggle 
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 'courses',
      label: 'My Courses',
      icon: <BookOpen className="w-5 h-5" />,
      badge: '3'
    },
    {
      id: 'interviews',
      label: 'Mock Interviews',
      icon: <Users className="w-5 h-5" />,
      submenu: [
        {
          id: 'upcoming-interviews',
          label: 'Upcoming',
          icon: <Calendar className="w-4 h-4" />,
          badge: '2'
        },
        {
          id: 'completed-interviews',
          label: 'Completed',
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          id: 'schedule-interview',
          label: 'Schedule New',
          icon: <Clock className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
      badge: '5'
    },
    {
      id: 'community',
      label: 'Community',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const bottomItems: SidebarItem[] = [
    {
      id: 'help',
      label: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const isActive = activeItem === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasSubmenu) {
              toggleExpanded(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
            isActive 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          } ${level > 0 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <span className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.badge}
                </span>
              )}
              {hasSubmenu && (
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                } ${isActive ? 'text-white' : 'text-gray-400'}`} />
              )}
            </div>
          )}
        </button>

        {hasSubmenu && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.submenu!.map(subItem => renderSidebarItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white h-full shadow-lg border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechMaster
              </h1>
            </div>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map(item => renderSidebarItem(item))}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        {bottomItems.map(item => renderSidebarItem(item))}
        
        {/* User Profile */}
        <div className={`mt-4 p-3 rounded-lg bg-gray-50 ${isCollapsed ? 'text-center' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">Premium Student</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button className="mt-3 w-full flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data
  const courses: Course[] = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      progress: 68,
      totalLessons: 45,
      completedLessons: 31,
      instructor: 'Sarah Chen',
      duration: '12 weeks',
      level: 'Intermediate',
      nextLesson: 'Advanced Hooks Patterns',
      category: 'Frontend',
      rating: 4.9
    },
    {
      id: '2',
      title: 'Data Science with Python',
      progress: 34,
      totalLessons: 38,
      completedLessons: 13,
      instructor: 'Alex Johnson',
      duration: '10 weeks',
      level: 'Beginner',
      nextLesson: 'Pandas DataFrames',
      category: 'Data Science',
      rating: 4.8
    },
    {
      id: '3',
      title: 'System Design Mastery',
      progress: 89,
      totalLessons: 25,
      completedLessons: 22,
      instructor: 'Michael Rodriguez',
      duration: '8 weeks',
      level: 'Advanced',
      nextLesson: 'Database Sharding',
      category: 'Backend',
      rating: 4.9
    }
  ];

  const mockInterviews: MockInterview[] = [
    {
      id: '1',
      company: 'Google',
      position: 'Senior Software Engineer',
      interviewer: 'Alex Johnson',
      date: '2025-05-30',
      time: '2:00 PM',
      status: 'upcoming'
    },
    {
      id: '2',
      company: 'Meta',
      position: 'Frontend Developer',
      interviewer: 'Sarah Chen',
      date: '2025-05-25',
      time: '10:00 AM',
      status: 'completed',
      score: 85
    }
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Course Completed',
      description: 'Completed your first course successfully',
      icon: '🎓',
      earned: true,
      date: '2025-05-15'
    },
    {
      id: '2',
      title: 'Interview Master',
      description: 'Completed 5 mock interviews',
      icon: '🎯',
      earned: true,
      date: '2025-05-20'
    },
    {
      id: '3',
      title: 'Code Ninja',
      description: 'Solve 50 coding challenges',
      icon: '⚡',
      earned: false
    }
  ];

  const stats = {
    totalCourses: 3,
    completedCourses: 1,
    totalHours: 124,
    streak: 15
  };

  const CategoryIcon = ({ category }: { category: string }) => {
    switch (category) {
      case 'Frontend':
        return <Code className="w-4 h-4" />;
      case 'Data Science':
        return <Database className="w-4 h-4" />;
      case 'Backend':
        return <Zap className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeTab}
        onItemClick={setActiveTab}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">Premium Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <>
                {/* Welcome Section */}
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h3>
                  <p className="text-gray-600">Continue your learning journey and achieve your tech career goals.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Courses</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.completedCourses}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalHours}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Day Streak</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.streak}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Continue Learning */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold text-gray-900">Continue Learning</h4>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                      </div>
                      
                      <div className="space-y-4">
                        {courses.map((course) => (
                          <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <CategoryIcon category={course.category} />
                                  <h5 className="font-semibold text-gray-900">{course.title}</h5>
                                </div>
                                <p className="text-sm text-gray-600">by {course.instructor}</p>
                                <p className="text-sm text-gray-500">Next: {course.nextLesson}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{course.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{course.duration}</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {course.level}
                                </span>
                              </div>
                              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                                <Play className="w-4 h-4" />
                                <span>Continue</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mock Interviews */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold text-gray-900">Mock Interviews</h4>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Schedule New</button>
                      </div>
                      
                      <div className="space-y-4">
                        {mockInterviews.map((interview) => (
                          <div key={interview.id} className="border border-gray-100 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-semibold text-gray-900">{interview.position}</h5>
                                <p className="text-sm text-gray-600">{interview.company}</p>
                                <p className="text-sm text-gray-500">with {interview.interviewer}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                interview.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {interview.status === 'upcoming' ? 'Upcoming' : 
                                 interview.status === 'completed' ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{interview.date}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{interview.time}</span>
                                </span>
                                {interview.score && (
                                  <span className="flex items-center space-x-1 text-green-600">
                                    <Trophy className="w-4 h-4" />
                                    <span>{interview.score}%</span>
                                  </span>
                                )}
                              </div>
                              {interview.status === 'upcoming' && (
                                <button className="text-blue-600 hover:text-blue-700 font-medium">Join</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar Content */}
                  <div className="space-y-6">
                    {/* Live Session */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Live Coding Session</h4>
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">Live Now!</span>
                      </div>
                      <p className="text-sm text-green-100 mb-4">Advanced React Patterns with Sarah Chen</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">1,234 Online</span>
                        <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                          Join Now
                        </button>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h4>
                      <div className="space-y-3">
                        {achievements.slice(0, 3).map((achievement) => (
                          <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                            achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <p className={`font-medium ${achievement.earned ? 'text-green-900' : 'text-gray-500'}`}>
                                {achievement.title}
                              </p>
                              <p className={`text-xs ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`}>
                                {achievement.description}
                              </p>
                              {achievement.date && (
                                <p className="text-xs text-green-500">{achievement.date}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Study Streak */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Study Streak</h4>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">🔥</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stats.streak} Days</p>
                        <p className="text-sm text-gray-600">Keep it up!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Other tab content can be added here */}
            {activeTab !== 'dashboard' && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 capitalize">{activeTab}</h3>
                <p className="text-gray-600">Content for {activeTab} will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;