import ManagementTable from "../components/ManagementTable";
import { useUsers } from "../queries/useUsers";

const Users = () => {
  const { data: users, isLoading, isError } = useUsers();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      {users && users.length > 0 ? (
        <ManagementTable users={users} />
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
