import { Navigate, useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../components/ui/button";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleManageDashboard = () => {
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/influencers");
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-16 bg-[#08090C] text-white bg-mesh-grid">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#FF6A88]/80">Your Profile</p>
            <h1 className="mt-3 text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}.</h1>
            <p className="mt-2 text-sm text-white/60">Review your account details and influencer profile information.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-[#FF6A88]/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#FF6A88] to-[#FF8E53] flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : user.name.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-white/60">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-[0.2em] mb-2">Account Type</h3>
                <p className="text-lg font-medium">{user.accountType ?? user.role}</p>
              </div>

              {user.phone && (
                <div>
                  <h3 className="text-sm text-white/60 uppercase tracking-[0.2em] mb-2">Phone</h3>
                  <p className="text-lg font-medium">{user.phone}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm text-white/60 uppercase tracking-[0.2em] mb-2">Role</h3>
                <p className="text-lg font-medium">{user.role}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-[#FF6A88]/10">
            <h2 className="text-xl font-semibold mb-4">Influencer Profile</h2>
            {!user.profile ? (
              <p className="text-sm text-white/60">No influencer profile details available yet.</p>
            ) : (
              <div className="space-y-4 text-sm text-white/70">
                {user.profile.instagramHandle && (
                  <div>
                    <p className="text-white/60 uppercase tracking-[0.2em] mb-1">Instagram Handle</p>
                    <p className="break-words">{user.profile.instagramHandle}</p>
                  </div>
                )}
                {user.profile.category && (
                  <div>
                    <p className="text-white/60 uppercase tracking-[0.2em] mb-1">Category</p>
                    <p>{user.profile.category}</p>
                  </div>
                )}
                {user.profile.location && (
                  <div>
                    <p className="text-white/60 uppercase tracking-[0.2em] mb-1">Location</p>
                    <p>{user.profile.location}</p>
                  </div>
                )}
                {user.profile.bio && (
                  <div>
                    <p className="text-white/60 uppercase tracking-[0.2em] mb-1">Bio</p>
                    <p>{user.profile.bio}</p>
                  </div>
                )}
                {user.profile.website && (
                  <div>
                    <p className="text-white/60 uppercase tracking-[0.2em] mb-1">Website</p>
                    <a href={user.profile.website} target="_blank" rel="noreferrer" className="text-[#FF6A88] hover:underline break-words">
                      {user.profile.website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={handleEditProfile}
            className="w-full sm:w-auto rounded-full bg-[#141620] border border-white/10 text-white hover:bg-[#1C1F2B] px-6 py-3"
          >
            Edit profile
          </Button>
          <Button
            onClick={handleManageDashboard}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#FF6A88] to-[#FF8E53] text-white px-6 py-3"
          >
            Manage dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
