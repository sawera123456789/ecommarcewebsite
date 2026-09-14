import { useApp } from '../context/AppContext';

const ProfilePage = () => {
  const { user } = useApp();

  return (
    <div className="container page-shell">
      <h2 className="section-title">Profile</h2>
      <div className="form-card">
        <p><strong>Name:</strong> {user?.name || 'Not available'}</p>
        <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
        <p><strong>Role:</strong> {user?.role || 'user'}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
