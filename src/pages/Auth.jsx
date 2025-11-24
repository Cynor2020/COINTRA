// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // ensure hooks/useAuth.jsx exists

export default function Auth() {
  const [tab, setTab] = useState('signup'); // 'signup' | 'login'
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl border border-neutral-weak shadow-soft-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-primary-text">{tab === 'signup' ? 'Create your account' : 'Login'}</h2>
          <div className="text-sm text-muted">
            <button className={`px-3 py-1 ${tab==='signup' ? 'bg-neutral-weak text-primary-text rounded' : ''}`} onClick={()=>setTab('signup')}>Sign up</button>
            <button className={`px-3 py-1 ml-2 ${tab==='login' ? 'bg-neutral-weak text-primary-text rounded' : ''}`} onClick={()=>setTab('login')}>Login</button>
          </div>
        </div>

        {tab === 'signup' ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
}

function SignupForm(){
  const { signup } = useAuth();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      if (!form.name || !form.email || form.password.length < 6) throw new Error('Please fill all fields. Password min 6 chars.');
      await signup(form);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {err && <div className="text-sm text-accent-red">{err}</div>}
      <input className="w-full p-2 rounded-md bg-bg-900 border border-neutral-weak" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input className="w-full p-2 rounded-md bg-bg-900 border border-neutral-weak" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input className="w-full p-2 rounded-md bg-bg-900 border border-neutral-weak" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-accent-blue text-bg-900 font-medium">{loading ? 'Creating...' : 'Create account & Login'}</button>
    </form>
  );
}

function LoginForm(){
  const { login } = useAuth();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {err && <div className="text-sm text-accent-red">{err}</div>}
      <input className="w-full p-2 rounded-md bg-bg-900 border border-neutral-weak" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input className="w-full p-2 rounded-md bg-bg-900 border border-neutral-weak" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <div className="flex justify-between items-center text-xs text-muted">
        <label className="flex items-center gap-2"><input type="checkbox" /> Remember</label>
        <a className="text-accent-blue">Forgot?</a>
      </div>
      <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-accent-blue text-bg-900 font-medium">{loading ? 'Logging...' : 'Login'}</button>
    </form>
  );
}