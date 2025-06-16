import { currentUser } from "@/lib/auth";

const SettingsPage = async () => {
  const session = await currentUser();
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default SettingsPage;
