import React, { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, FileText, Download, Upload, LogOut, Eye, Printer, Edit, Trash2, Save, X } from 'lucide-react';
import './App.css';

// Initial admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'bright2025'
};

// Fee structure by class
const FEE_STRUCTURE = {
  'BABY I': {
    payments: [260000, 220000, 220000, 220000],
    annualTotal: 920000,
    oneTime: {
      admissionFee: 10000,
      interviewFee: 10000,
      cautionMoney: 10000,
      stationery: 60000,
      textbooks: 0
    },
    uniforms: {
      shortTrousers: 30000, // males only
      skirt: 40000, // females only
      shirt: 28000,
      sweater: 17000,
      tshirt: 20000,
      tracksuit: 0
    }
  },
  'BABY II': {
    payments: [230000, 190000, 190000, 190000],
    annualTotal: 800000,
    oneTime: {
      admissionFee: 10000,
      interviewFee: 10000,
      cautionMoney: 10000,
      stationery: 60000,
      textbooks: 0
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 28000,
      sweater: 17000,
      tshirt: 20000,
      tracksuit: 0
    }
  },
  'MIDDLE CLASS': {
    payments: [230000, 190000, 190000, 190000],
    annualTotal: 800000,
    oneTime: {
      admissionFee: 10000,
      interviewFee: 10000,
      cautionMoney: 10000,
      stationery: 60000,
      textbooks: 0
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 28000,
      sweater: 17000,
      tshirt: 20000,
      tracksuit: 0
    }
  },
  'PRE-UNIT': {
    payments: [230000, 190000, 190000, 190000],
    annualTotal: 800000,
    oneTime: {
      admissionFee: 10000,
      interviewFee: 10000,
      cautionMoney: 10000,
      stationery: 60000,
      textbooks: 0
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 28000,
      sweater: 17000,
      tshirt: 20000,
      tracksuit: 0
    }
  },
  'GRADE ONE': {
    payments: [425000, 385000, 385000, 385000],
    annualTotal: 1580000,
    oneTime: {
      admissionFee: 20000,
      interviewFee: 20000,
      cautionMoney: 20000,
      stationery: 100000,
      textbooks: 70000
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 30000,
      sweater: 35000,
      tshirt: 24000,
      tracksuit: 28000
    }
  },
  'GRADE TWO': {
    payments: [425000, 385000, 385000, 385000],
    annualTotal: 1580000,
    oneTime: {
      admissionFee: 20000,
      interviewFee: 20000,
      cautionMoney: 20000,
      stationery: 100000,
      textbooks: 70000
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 30000,
      sweater: 35000,
      tshirt: 24000,
      tracksuit: 28000
    }
  },
  'GRADE THREE': {
    payments: [425000, 385000, 385000, 385000],
    annualTotal: 1580000,
    oneTime: {
      admissionFee: 20000,
      interviewFee: 20000,
      cautionMoney: 20000,
      stationery: 100000,
      textbooks: 70000
    },
    uniforms: {
      shortTrousers: 30000,
      skirt: 40000,
      shirt: 30000,
      sweater: 35000,
      tshirt: 24000,
      tracksuit: 28000
    }
  }
};

const CLASSES = ['BABY I', 'BABY II', 'MIDDLE CLASS', 'PRE-UNIT', 'GRADE ONE', 'GRADE TWO', 'GRADE THREE'];

const BrightSchoolsSIS = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [students, setStudents] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('brightSchoolsStudents');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    const savedLogin = sessionStorage.getItem('brightSchoolsLogin');
    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Save students to localStorage whenever they change
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('brightSchoolsStudents', JSON.stringify(students));
    }
  }, [students]);
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === ADMIN_CREDENTIALS.username && 
        loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      sessionStorage.setItem('brightSchoolsLogin', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('brightSchoolsLogin');
    setLoginForm({ username: '', password: '' });
  };
  
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const NewStudentForm = ({ onSave, onCancel, editData = null }) => {
    const [formData, setFormData] = useState(editData || {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      gender: '',
      class: '',
      residence: '',
      father: { name: '', contact: '', occupation: '', residence: '' },
      mother: { name: '', contact: '', occupation: '', residence: '' },
      relative: { name: '', contact: '', occupation: '', residence: '', relationship: '' },
      fees: {
        annualTotal: 0,
        payment1: 0,
        payment2: 0,
        payment3: 0,
        payment4: 0,
        admissionFee: 0,
        interviewFee: 0,
        cautionMoney: 0,
        stationery: 0,
        textbooks: 0,
        shortTrousers: 0,
        skirt: 0,
        shirt: 0,
        sweater: 0,
        tshirt: 0,
        tracksuit: 0
      },
      payments: []
    });
    
    // Auto-populate fees when class is selected
    const handleClassChange = (selectedClass) => {
      setFormData(prev => {
        const classFees = FEE_STRUCTURE[selectedClass];
        if (!classFees) {
          return { ...prev, class: selectedClass };
        }
        
        // Determine uniform fees based on gender
        const gender = prev.gender;
        const uniformFees = {
          shortTrousers: gender === 'Male' ? classFees.uniforms.shortTrousers : 0,
          skirt: gender === 'Female' ? classFees.uniforms.skirt : 0,
          shirt: classFees.uniforms.shirt,
          sweater: classFees.uniforms.sweater,
          tshirt: classFees.uniforms.tshirt,
          tracksuit: classFees.uniforms.tracksuit
        };
        
        return {
          ...prev,
          class: selectedClass,
          fees: {
            annualTotal: classFees.annualTotal,
            payment1: classFees.payments[0],
            payment2: classFees.payments[1],
            payment3: classFees.payments[2],
            payment4: classFees.payments[3],
            admissionFee: classFees.oneTime.admissionFee,
            interviewFee: classFees.oneTime.interviewFee,
            cautionMoney: classFees.oneTime.cautionMoney,
            stationery: classFees.oneTime.stationery,
            textbooks: classFees.oneTime.textbooks,
            ...uniformFees
          }
        };
      });
    };
    
    // Update uniforms when gender changes
    const handleGenderChange = (selectedGender) => {
      setFormData(prev => {
        if (!prev.class) {
          return { ...prev, gender: selectedGender };
        }
        
        const classFees = FEE_STRUCTURE[prev.class];
        if (!classFees) {
          return { ...prev, gender: selectedGender };
        }
        
        const uniformFees = {
          shortTrousers: selectedGender === 'Male' ? classFees.uniforms.shortTrousers : 0,
          skirt: selectedGender === 'Female' ? classFees.uniforms.skirt : 0
        };
        
        return {
          ...prev,
          gender: selectedGender,
          fees: {
            ...prev.fees,
            ...uniformFees
          }
        };
      });
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const studentData = {
        ...formData,
        id: editData?.id || Date.now().toString(),
        age: calculateAge(formData.dob),
        createdAt: editData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onSave(studentData);
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          {editData ? 'Edit Student' : 'Add New Student'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  className="border p-2 rounded"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <input
                  required
                  type="text"
                  placeholder="Middle Name"
                  className="border p-2 rounded"
                  value={formData.middleName}
                  onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                />
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  className="border p-2 rounded"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
                  <input
                    required
                    type="date"
                    className="border p-2 rounded w-full"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Gender</label>
                  <select
                    required
                    className="border p-2 rounded w-full"
                    value={formData.gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Class</label>
                  <select
                    required
                    className="border p-2 rounded w-full"
                    value={formData.class}
                    onChange={(e) => handleClassChange(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Residence</label>
                  <input
                    required
                    type="text"
                    placeholder="Residence"
                    className="border p-2 rounded w-full"
                    value={formData.residence}
                    onChange={(e) => setFormData({...formData, residence: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Father's Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Father's Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Father's Name"
                  className="border p-2 rounded"
                  value={formData.father.name}
                  onChange={(e) => setFormData({...formData, father: {...formData.father, name: e.target.value}})}
                />
                <input
                  type="tel"
                  placeholder="Contact"
                  className="border p-2 rounded"
                  value={formData.father.contact}
                  onChange={(e) => setFormData({...formData, father: {...formData.father, contact: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Occupation"
                  className="border p-2 rounded"
                  value={formData.father.occupation}
                  onChange={(e) => setFormData({...formData, father: {...formData.father, occupation: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Residence"
                  className="border p-2 rounded"
                  value={formData.father.residence}
                  onChange={(e) => setFormData({...formData, father: {...formData.father, residence: e.target.value}})}
                />
              </div>
            </div>
            
            {/* Mother's Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Mother's Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Mother's Name"
                  className="border p-2 rounded"
                  value={formData.mother.name}
                  onChange={(e) => setFormData({...formData, mother: {...formData.mother, name: e.target.value}})}
                />
                <input
                  type="tel"
                  placeholder="Contact"
                  className="border p-2 rounded"
                  value={formData.mother.contact}
                  onChange={(e) => setFormData({...formData, mother: {...formData.mother, contact: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Occupation"
                  className="border p-2 rounded"
                  value={formData.mother.occupation}
                  onChange={(e) => setFormData({...formData, mother: {...formData.mother, occupation: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Residence"
                  className="border p-2 rounded"
                  value={formData.mother.residence}
                  onChange={(e) => setFormData({...formData, mother: {...formData.mother, residence: e.target.value}})}
                />
              </div>
            </div>
            
            {/* Relative's Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Relative/Guardian Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Relative's Name"
                  className="border p-2 rounded"
                  value={formData.relative.name}
                  onChange={(e) => setFormData({...formData, relative: {...formData.relative, name: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  className="border p-2 rounded"
                  value={formData.relative.relationship}
                  onChange={(e) => setFormData({...formData, relative: {...formData.relative, relationship: e.target.value}})}
                />
                <input
                  type="tel"
                  placeholder="Contact"
                  className="border p-2 rounded"
                  value={formData.relative.contact}
                  onChange={(e) => setFormData({...formData, relative: {...formData.relative, contact: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Occupation"
                  className="border p-2 rounded"
                  value={formData.relative.occupation}
                  onChange={(e) => setFormData({...formData, relative: {...formData.relative, occupation: e.target.value}})}
                />
                <input
                  type="text"
                  placeholder="Residence"
                  className="border p-2 rounded md:col-span-2"
                  value={formData.relative.residence}
                  onChange={(e) => setFormData({...formData, relative: {...formData.relative, residence: e.target.value}})}
                />
              </div>
            </div>
            
            {/* Fee Structure */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Fee Structure (TZS) - Auto-filled based on class</h3>
              
              <div className="bg-blue-50 p-4 rounded mb-4">
                <h4 className="font-semibold mb-2">Annual School Fees</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Payment 1</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.payment1}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, payment1: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment 2</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.payment2}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, payment2: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment 3</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.payment3}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, payment3: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment 4</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.payment4}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, payment4: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 font-bold">Annual Total</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-gray-100 font-bold"
                      value={formData.fees.annualTotal}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded mb-4">
                <h4 className="font-semibold mb-2">One-Time Payments</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="text-sm text-gray-600">Admission Fee</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.admissionFee}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, admissionFee: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Interview Fee</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.interviewFee}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, interviewFee: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Caution Money</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.cautionMoney}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, cautionMoney: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Stationery</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.stationery}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, stationery: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Textbooks</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.textbooks}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, textbooks: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-semibold mb-2">Uniform Fees</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.gender === 'Male' && (
                    <div>
                      <label className="text-sm text-gray-600">Short Trousers (2)</label>
                      <input
                        type="number"
                        className="border p-2 rounded w-full bg-white"
                        value={formData.fees.shortTrousers}
                        onChange={(e) => setFormData({...formData, fees: {...formData.fees, shortTrousers: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                  )}
                  {formData.gender === 'Female' && (
                    <div>
                      <label className="text-sm text-gray-600">Skirt (2)</label>
                      <input
                        type="number"
                        className="border p-2 rounded w-full bg-white"
                        value={formData.fees.skirt}
                        onChange={(e) => setFormData({...formData, fees: {...formData.fees, skirt: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-600">Shirt (2)</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.shirt}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, shirt: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Sweater</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.sweater}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, sweater: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">T-shirt (2)</label>
                    <input
                      type="number"
                      className="border p-2 rounded w-full bg-white"
                      value={formData.fees.tshirt}
                      onChange={(e) => setFormData({...formData, fees: {...formData.fees, tshirt: parseFloat(e.target.value) || 0}})}
                    />
                  </div>
                  {formData.fees.tracksuit > 0 && (
                    <div>
                      <label className="text-sm text-gray-600">Tracksuit</label>
                      <input
                        type="number"
                        className="border p-2 rounded w-full bg-white"
                        value={formData.fees.tracksuit}
                        onChange={(e) => setFormData({...formData, fees: {...formData.fees, tracksuit: parseFloat(e.target.value) || 0}})}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Save size={18} />
              {editData ? 'Update Student' : 'Save Student'}
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 flex items-center gap-2">
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  const PaymentForm = ({ student, onSave, onCancel }) => {
    const [payment, setPayment] = useState({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'payment1',
      notes: ''
    });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedStudent = {
        ...student,
        payments: [...(student.payments || []), { ...payment, id: Date.now().toString() }]
      };
      onSave(updatedStudent);
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Record Payment</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (TZS)</label>
              <input
                required
                type="number"
                className="border p-2 rounded w-full"
                value={payment.amount}
                onChange={(e) => setPayment({...payment, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Date</label>
              <input
                required
                type="date"
                className="border p-2 rounded w-full"
                value={payment.date}
                onChange={(e) => setPayment({...payment, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Category</label>
              <select
                className="border p-2 rounded w-full"
                value={payment.category}
                onChange={(e) => setPayment({...payment, category: e.target.value})}
              >
                <optgroup label="School Fees">
                  <option value="payment1">Payment 1</option>
                  <option value="payment2">Payment 2</option>
                  <option value="payment3">Payment 3</option>
                  <option value="payment4">Payment 4</option>
                </optgroup>
                <optgroup label="One-Time Fees">
                  <option value="admissionFee">Admission Fee</option>
                  <option value="interviewFee">Interview Fee</option>
                  <option value="cautionMoney">Caution Money</option>
                  <option value="stationery">Stationery</option>
                  <option value="textbooks">Textbooks</option>
                </optgroup>
                <optgroup label="Uniforms">
                  <option value="shortTrousers">Short Trousers</option>
                  <option value="skirt">Skirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="sweater">Sweater</option>
                  <option value="tshirt">T-shirt</option>
                  <option value="tracksuit">Tracksuit</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="other">Other Payment</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                className="border p-2 rounded w-full"
                value={payment.notes}
                onChange={(e) => setPayment({...payment, notes: e.target.value})}
                rows="2"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
              <Save size={18} />
              Record Payment
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  const calculateBalance = (student) => {
    const fees = student.fees || {};
    
    // Total all fees
    const totalFees = (fees.annualTotal || 0) +
                     (fees.admissionFee || 0) +
                     (fees.interviewFee || 0) +
                     (fees.cautionMoney || 0) +
                     (fees.stationery || 0) +
                     (fees.textbooks || 0) +
                     (fees.shortTrousers || 0) +
                     (fees.skirt || 0) +
                     (fees.shirt || 0) +
                     (fees.sweater || 0) +
                     (fees.tshirt || 0) +
                     (fees.tracksuit || 0);
    
    const totalPaid = (student.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    return totalFees - totalPaid;
  };
  
  // Calculate paid amount for a specific category
  const calculatePaidByCategory = (student, category) => {
    return (student.payments || [])
      .filter(p => p.category === category)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  };
  
  // Get fee breakdown with paid amounts and balances
  const getFeeBreakdown = (student) => {
    const fees = student.fees || {};
    const breakdown = [];
    
    // School Fees
    if (fees.payment1) {
      const paid = calculatePaidByCategory(student, 'payment1');
      breakdown.push({ name: 'Payment 1', amount: fees.payment1, paid, balance: fees.payment1 - paid, category: 'payment1' });
    }
    if (fees.payment2) {
      const paid = calculatePaidByCategory(student, 'payment2');
      breakdown.push({ name: 'Payment 2', amount: fees.payment2, paid, balance: fees.payment2 - paid, category: 'payment2' });
    }
    if (fees.payment3) {
      const paid = calculatePaidByCategory(student, 'payment3');
      breakdown.push({ name: 'Payment 3', amount: fees.payment3, paid, balance: fees.payment3 - paid, category: 'payment3' });
    }
    if (fees.payment4) {
      const paid = calculatePaidByCategory(student, 'payment4');
      breakdown.push({ name: 'Payment 4', amount: fees.payment4, paid, balance: fees.payment4 - paid, category: 'payment4' });
    }
    
    // One-Time Fees
    if (fees.admissionFee) {
      const paid = calculatePaidByCategory(student, 'admissionFee');
      breakdown.push({ name: 'Admission Fee', amount: fees.admissionFee, paid, balance: fees.admissionFee - paid, category: 'admissionFee' });
    }
    if (fees.interviewFee) {
      const paid = calculatePaidByCategory(student, 'interviewFee');
      breakdown.push({ name: 'Interview Fee', amount: fees.interviewFee, paid, balance: fees.interviewFee - paid, category: 'interviewFee' });
    }
    if (fees.cautionMoney) {
      const paid = calculatePaidByCategory(student, 'cautionMoney');
      breakdown.push({ name: 'Caution Money', amount: fees.cautionMoney, paid, balance: fees.cautionMoney - paid, category: 'cautionMoney' });
    }
    if (fees.stationery) {
      const paid = calculatePaidByCategory(student, 'stationery');
      breakdown.push({ name: 'Stationery', amount: fees.stationery, paid, balance: fees.stationery - paid, category: 'stationery' });
    }
    if (fees.textbooks) {
      const paid = calculatePaidByCategory(student, 'textbooks');
      breakdown.push({ name: 'Textbooks', amount: fees.textbooks, paid, balance: fees.textbooks - paid, category: 'textbooks' });
    }
    
    // Uniforms
    if (fees.shortTrousers) {
      const paid = calculatePaidByCategory(student, 'shortTrousers');
      breakdown.push({ name: 'Short Trousers (2)', amount: fees.shortTrousers, paid, balance: fees.shortTrousers - paid, category: 'shortTrousers' });
    }
    if (fees.skirt) {
      const paid = calculatePaidByCategory(student, 'skirt');
      breakdown.push({ name: 'Skirt (2)', amount: fees.skirt, paid, balance: fees.skirt - paid, category: 'skirt' });
    }
    if (fees.shirt) {
      const paid = calculatePaidByCategory(student, 'shirt');
      breakdown.push({ name: 'Shirt (2)', amount: fees.shirt, paid, balance: fees.shirt - paid, category: 'shirt' });
    }
    if (fees.sweater) {
      const paid = calculatePaidByCategory(student, 'sweater');
      breakdown.push({ name: 'Sweater', amount: fees.sweater, paid, balance: fees.sweater - paid, category: 'sweater' });
    }
    if (fees.tshirt) {
      const paid = calculatePaidByCategory(student, 'tshirt');
      breakdown.push({ name: 'T-shirt (2)', amount: fees.tshirt, paid, balance: fees.tshirt - paid, category: 'tshirt' });
    }
    if (fees.tracksuit) {
      const paid = calculatePaidByCategory(student, 'tracksuit');
      breakdown.push({ name: 'Tracksuit', amount: fees.tracksuit, paid, balance: fees.tracksuit - paid, category: 'tracksuit' });
    }
    
    return breakdown;
  };
  
  const StudentDetailsView = ({ student, onClose, onEdit, onAddPayment }) => {
    const balance = calculateBalance(student);
    const totalPaid = (student.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const fees = student.fees || {};
    const totalFees = (fees.annualTotal || 0) +
                     (fees.admissionFee || 0) +
                     (fees.interviewFee || 0) +
                     (fees.cautionMoney || 0) +
                     (fees.stationery || 0) +
                     (fees.textbooks || 0) +
                     (fees.shortTrousers || 0) +
                     (fees.skirt || 0) +
                     (fees.shirt || 0) +
                     (fees.sweater || 0) +
                     (fees.tshirt || 0) +
                     (fees.tracksuit || 0);
    
    const feeBreakdown = getFeeBreakdown(student);
    
    const printReport = () => {
      const feeBreakdown = getFeeBreakdown(student);
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Student Report - ${student.firstName} ${student.lastName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
              .section { margin-bottom: 20px; }
              .section h3 { background: #1e40af; color: white; padding: 8px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f3f4f6; font-weight: 600; }
              .total { font-weight: bold; background: #e5e7eb; }
              .grand-total { font-weight: bold; background: #1e40af; color: white; }
              .paid { color: #16a34a; font-weight: 600; }
              .balance { color: #dc2626; font-weight: 600; }
              .status-paid { background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
              .status-partial { background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
              .status-unpaid { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 11px; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>BRIGHT SCHOOLS</h1>
              <p>Bright Academy Daycare Center & Bright English Medium Pre & Primary School</p>
              <h2>Student Payment Report</h2>
            </div>
            
            <div class="section">
              <h3>Personal Information</h3>
              <table>
                <tr><td><strong>Name:</strong></td><td>${student.firstName} ${student.middleName} ${student.lastName}</td></tr>
                <tr><td><strong>Date of Birth:</strong></td><td>${student.dob} (Age: ${student.age} years)</td></tr>
                <tr><td><strong>Gender:</strong></td><td>${student.gender}</td></tr>
                <tr><td><strong>Class:</strong></td><td>${student.class}</td></tr>
                <tr><td><strong>Residence:</strong></td><td>${student.residence}</td></tr>
              </table>
            </div>
            
            <div class="section">
              <h3>Parent/Guardian Information</h3>
              <table>
                <tr><th>Relation</th><th>Name</th><th>Contact</th><th>Occupation</th></tr>
                <tr><td>Father</td><td>${student.father.name || 'N/A'}</td><td>${student.father.contact || 'N/A'}</td><td>${student.father.occupation || 'N/A'}</td></tr>
                <tr><td>Mother</td><td>${student.mother.name || 'N/A'}</td><td>${student.mother.contact || 'N/A'}</td><td>${student.mother.occupation || 'N/A'}</td></tr>
                ${student.relative.name ? `<tr><td>${student.relative.relationship}</td><td>${student.relative.name}</td><td>${student.relative.contact}</td><td>${student.relative.occupation}</td></tr>` : ''}
              </table>
            </div>
            
            <div class="section">
              <h3>Detailed Fee Breakdown</h3>
              <table>
                <thead>
                  <tr>
                    <th>Fee Item</th>
                    <th class="text-right">Amount Due</th>
                    <th class="text-right">Paid</th>
                    <th class="text-right">Balance</th>
                    <th class="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${feeBreakdown.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td class="text-right">TZS ${item.amount.toLocaleString()}</td>
                      <td class="text-right paid">TZS ${item.paid.toLocaleString()}</td>
                      <td class="text-right ${item.balance > 0 ? 'balance' : 'paid'}">TZS ${item.balance.toLocaleString()}</td>
                      <td class="text-center">
                        ${item.balance === 0 ? '<span class="status-paid">PAID</span>' : 
                          item.paid > 0 ? '<span class="status-partial">PARTIAL</span>' : 
                          '<span class="status-unpaid">UNPAID</span>'}
                      </td>
                    </tr>
                  `).join('')}
                  <tr class="grand-total">
                    <td>GRAND TOTAL</td>
                    <td class="text-right">TZS ${totalFees.toLocaleString()}</td>
                    <td class="text-right">TZS ${totalPaid.toLocaleString()}</td>
                    <td class="text-right">TZS ${balance.toLocaleString()}</td>
                    <td class="text-center">${balance === 0 ? 'FULLY PAID' : 'OWING'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="section">
              <h3>Payment History</h3>
              <table>
                <tr><th>Date</th><th>Category</th><th class="text-right">Amount</th><th>Notes</th></tr>
                ${(student.payments || []).length === 0 ? 
                  '<tr><td colspan="4" class="text-center">No payments recorded</td></tr>' :
                  (student.payments || []).map(p => `
                    <tr>
                      <td>${p.date}</td>
                      <td>${p.category.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td class="text-right paid">TZS ${p.amount.toLocaleString()}</td>
                      <td>${p.notes || '-'}</td>
                    </tr>
                  `).join('')}
              </table>
            </div>
            
            <p style="margin-top: 40px; text-align: center; color: #666;">
              Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </p>
            <p style="text-align: center; color: #666; margin-top: 10px;">
              <strong>BRIGHT SCHOOLS - Student Information System</strong>
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto max-h-screen overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">
              {student.firstName} {student.middleName} {student.lastName}
            </h2>
            <p className="text-gray-600">Class: {student.class} | Age: {student.age}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={printReport} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Printer size={18} />
              Print
            </button>
            <button onClick={onEdit} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center gap-2">
              <Edit size={18} />
              Edit
            </button>
            <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex items-center gap-2">
              <X size={18} />
              Close
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>DOB:</strong> {student.dob}</p>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>Residence:</strong> {student.residence}</p>
            </div>
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">Fee Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Total Fees:</strong> TZS {totalFees.toLocaleString()}</p>
              <p><strong>Total Paid:</strong> TZS {totalPaid.toLocaleString()}</p>
              <p className={`text-lg font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                <strong>Balance:</strong> TZS {balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">Parent/Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Father</p>
              <p>{student.father.name}</p>
              <p>{student.father.contact}</p>
              <p className="text-gray-600">{student.father.occupation}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Mother</p>
              <p>{student.mother.name}</p>
              <p>{student.mother.contact}</p>
              <p className="text-gray-600">{student.mother.occupation}</p>
            </div>
            {student.relative.name && (
              <div>
                <p className="font-semibold text-gray-700">{student.relative.relationship}</p>
                <p>{student.relative.name}</p>
                <p>{student.relative.contact}</p>
                <p className="text-gray-600">{student.relative.occupation}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">Detailed Fee Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Fee Item</th>
                  <th className="p-2 text-right">Amount Due</th>
                  <th className="p-2 text-right">Paid</th>
                  <th className="p-2 text-right">Balance</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeBreakdown.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-right">TZS {item.amount.toLocaleString()}</td>
                    <td className="p-2 text-right font-semibold text-green-600">TZS {item.paid.toLocaleString()}</td>
                    <td className="p-2 text-right font-semibold" style={{color: item.balance > 0 ? '#dc2626' : '#16a34a'}}>
                      TZS {item.balance.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      {item.balance === 0 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">PAID</span>
                      ) : item.paid > 0 ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">PARTIAL</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">UNPAID</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-400 font-bold bg-gray-50">
                  <td className="p-2">GRAND TOTAL</td>
                  <td className="p-2 text-right">TZS {totalFees.toLocaleString()}</td>
                  <td className="p-2 text-right text-green-600">TZS {totalPaid.toLocaleString()}</td>
                  <td className="p-2 text-right" style={{color: balance > 0 ? '#dc2626' : '#16a34a'}}>
                    TZS {balance.toLocaleString()}
                  </td>
                  <td className="p-2 text-center">
                    {balance === 0 ? (
                      <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">FULLY PAID</span>
                    ) : (
                      <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">OWING</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 border p-4 rounded">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-blue-800">Payment History</h3>
            <button onClick={onAddPayment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
              <Plus size={18} />
              Add Payment
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-right">Amount</th>
                  <th className="p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {(student.payments || []).length === 0 ? (
                  <tr><td colSpan="4" className="p-4 text-center text-gray-500">No payments recorded</td></tr>
                ) : (
                  student.payments.map(payment => (
                    <tr key={payment.id} className="border-t">
                      <td className="p-2">{payment.date}</td>
                      <td className="p-2 capitalize">{payment.category.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="p-2 text-right font-semibold text-green-600">TZS {payment.amount.toLocaleString()}</td>
                      <td className="p-2">{payment.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const Dashboard = () => {
    const totalStudents = students.length;
    const totalFees = students.reduce((sum, s) => {
      const fees = s.fees || {};
      return sum + (fees.annualTotal || 0) + (fees.admissionFee || 0) + (fees.interviewFee || 0) +
             (fees.cautionMoney || 0) + (fees.stationery || 0) + (fees.textbooks || 0) +
             (fees.shortTrousers || 0) + (fees.skirt || 0) + (fees.shirt || 0) +
             (fees.sweater || 0) + (fees.tshirt || 0) + (fees.tracksuit || 0);
    }, 0);
    const totalPaid = students.reduce((sum, s) => sum + (s.payments || []).reduce((p, pay) => p + pay.amount, 0), 0);
    const totalBalance = totalFees - totalPaid;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Students</h3>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Collected</h3>
            <p className="text-2xl font-bold">TZS {totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-red-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Balance</h3>
            <p className="text-2xl font-bold">TZS {totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-purple-600 text-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Total Fees</h3>
            <p className="text-2xl font-bold">TZS {totalFees.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Students</h3>
          <div className="space-y-2">
            {students.slice(0, 5).map(student => (
              <div key={student.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-600">Class: {student.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Balance: TZS {calculateBalance(student).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const AllStudentsList = () => {
    const filteredStudents = students.filter(s => 
      `${s.firstName} ${s.middleName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const printAllStudents = () => {
      const printWindow = window.open('', '', 'width=1000,height=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>All Students Payment Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; }
              td, th { border: 1px solid #ddd; padding: 6px; }
              th { background: #1e40af; color: white; font-weight: 600; }
              .total { font-weight: bold; background: #e5e7eb; }
              .paid { color: #16a34a; }
              .balance { color: #dc2626; }
              .text-right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>BRIGHT SCHOOLS</h1>
              <h2>All Students Payment Summary Report</h2>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th class="text-right">Total Fees</th>
                  <th class="text-right">Paid</th>
                  <th class="text-right">Balance</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                ${students.map((s, i) => {
                  const fees = s.fees || {};
                  const totalFees = (fees.annualTotal || 0) +
                                   (fees.admissionFee || 0) +
                                   (fees.interviewFee || 0) +
                                   (fees.cautionMoney || 0) +
                                   (fees.stationery || 0) +
                                   (fees.textbooks || 0) +
                                   (fees.shortTrousers || 0) +
                                   (fees.skirt || 0) +
                                   (fees.shirt || 0) +
                                   (fees.sweater || 0) +
                                   (fees.tshirt || 0) +
                                   (fees.tracksuit || 0);
                  const paid = (s.payments || []).reduce((sum, p) => sum + p.amount, 0);
                  const balance = totalFees - paid;
                  return `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${s.firstName} ${s.middleName} ${s.lastName}</td>
                      <td>${s.class}</td>
                      <td class="text-right">TZS ${totalFees.toLocaleString()}</td>
                      <td class="text-right paid">TZS ${paid.toLocaleString()}</td>
                      <td class="text-right ${balance > 0 ? 'balance' : 'paid'}">TZS ${balance.toLocaleString()}</td>
                      <td>${s.father.contact || s.mother.contact || 'N/A'}</td>
                    </tr>
                  `;
                }).join('')}
                <tr class="total">
                  <td colspan="3"><strong>TOTALS</strong></td>
                  <td class="text-right"><strong>TZS ${students.reduce((sum, s) => {
                    const fees = s.fees || {};
                    return sum + (fees.annualTotal || 0) + (fees.admissionFee || 0) + (fees.interviewFee || 0) +
                           (fees.cautionMoney || 0) + (fees.stationery || 0) + (fees.textbooks || 0) +
                           (fees.shortTrousers || 0) + (fees.skirt || 0) + (fees.shirt || 0) +
                           (fees.sweater || 0) + (fees.tshirt || 0) + (fees.tracksuit || 0);
                  }, 0).toLocaleString()}</strong></td>
                  <td class="text-right paid"><strong>TZS ${students.reduce((sum, s) => 
                    sum + (s.payments || []).reduce((p, pay) => p + pay.amount, 0), 0).toLocaleString()}</strong></td>
                  <td class="text-right balance"><strong>TZS ${students.reduce((sum, s) => {
                    const fees = s.fees || {};
                    const totalFees = (fees.annualTotal || 0) + (fees.admissionFee || 0) + (fees.interviewFee || 0) +
                                     (fees.cautionMoney || 0) + (fees.stationery || 0) + (fees.textbooks || 0) +
                                     (fees.shortTrousers || 0) + (fees.skirt || 0) + (fees.shirt || 0) +
                                     (fees.sweater || 0) + (fees.tshirt || 0) + (fees.tracksuit || 0);
                    const paid = (s.payments || []).reduce((p, pay) => p + pay.amount, 0);
                    return sum + (totalFees - paid);
                  }, 0).toLocaleString()}</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 20px; text-align: center; color: #666;">
              <strong>Total Students: ${students.length}</strong>
            </p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or class..."
              className="border p-2 pl-10 rounded w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={printAllStudents} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Printer size={18} />
            Print All
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-right">Total Fees</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Balance</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-gray-500">No students found</td></tr>
                ) : (
                  filteredStudents.map(student => {
                    const fees = student.fees || {};
                    const totalFees = (fees.annualTotal || 0) +
                                     (fees.admissionFee || 0) +
                                     (fees.interviewFee || 0) +
                                     (fees.cautionMoney || 0) +
                                     (fees.stationery || 0) +
                                     (fees.textbooks || 0) +
                                     (fees.shortTrousers || 0) +
                                     (fees.skirt || 0) +
                                     (fees.shirt || 0) +
                                     (fees.sweater || 0) +
                                     (fees.tshirt || 0) +
                                     (fees.tracksuit || 0);
                    const paid = (student.payments || []).reduce((sum, p) => sum + p.amount, 0);
                    const balance = totalFees - paid;
                    
                    return (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{student.firstName} {student.middleName} {student.lastName}</td>
                        <td className="p-3">{student.class}</td>
                        <td className="p-3 text-right">TZS {totalFees.toLocaleString()}</td>
                        <td className="p-3 text-right">TZS {paid.toLocaleString()}</td>
                        <td className={`p-3 text-right font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          TZS {balance.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setSelectedStudent(student)} className="text-blue-600 hover:text-blue-800">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => setEditingStudent(student)} className="text-yellow-600 hover:text-yellow-800">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => {
                              setDeleteConfirm(student);
                            }} className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const exportData = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bright_schools_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  
  const importData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setStudents(importedData);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentStudent, setPaymentStudent] = useState(null);
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">BRIGHT SCHOOLS</h1>
            <p className="text-gray-600 mt-2">Student Information System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                className="border p-3 rounded w-full"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="border p-3 rounded w-full"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold">
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Default credentials:</p>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>bright2025</strong></p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">BRIGHT SCHOOLS SIS</h1>
            <p className="text-sm text-blue-200">Student Information System</p>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={exportData} className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded hover:bg-blue-600">
              <Download size={18} />
              Export
            </button>
            <label className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
              <Upload size={18} />
              Import
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded hover:bg-red-700">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-4">
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-blue-900'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('students')}
            className={`px-4 py-2 rounded ${currentView === 'students' ? 'bg-blue-600 text-white' : 'bg-white text-blue-900'}`}
          >
            All Students
          </button>
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <UserPlus size={18} />
            Add New Student
          </button>
        </div>
        
        {showAddStudent && (
          <NewStudentForm
            onSave={(student) => {
              setStudents([...students, student]);
              setShowAddStudent(false);
            }}
            onCancel={() => setShowAddStudent(false)}
          />
        )}
        
        {editingStudent && (
          <NewStudentForm
            editData={editingStudent}
            onSave={(updatedStudent) => {
              setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
              setEditingStudent(null);
            }}
            onCancel={() => setEditingStudent(null)}
          />
        )}
        
        {selectedStudent && !showPaymentForm && (
          <StudentDetailsView
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onEdit={() => {
              setEditingStudent(selectedStudent);
              setSelectedStudent(null);
            }}
            onAddPayment={() => {
              setPaymentStudent(selectedStudent);
              setShowPaymentForm(true);
            }}
          />
        )}
        
        {showPaymentForm && paymentStudent && (
          <PaymentForm
            student={paymentStudent}
            onSave={(updatedStudent) => {
              setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
              setShowPaymentForm(false);
              setSelectedStudent(updatedStudent);
              setPaymentStudent(null);
            }}
            onCancel={() => {
              setShowPaymentForm(false);
              setPaymentStudent(null);
            }}
          />
        )}
        
        {!showAddStudent && !editingStudent && !selectedStudent && !showPaymentForm && (
          <>
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'students' && <AllStudentsList />}
          </>
        )}
        
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
              <h3 className="text-xl font-bold text-red-600 mb-4">Confirm Delete</h3>
              <p className="mb-6">
                Are you sure you want to delete <strong>{deleteConfirm.firstName} {deleteConfirm.lastName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStudents(students.filter(s => s.id !== deleteConfirm.id));
                    setDeleteConfirm(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrightSchoolsSIS;