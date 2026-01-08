import { useUsers } from "../queries/getUsers";

const Users = () => {
  const { data, isLoading, isError } = useUsers();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      {data && data.length > 0 ? (
        <ul>
          {data.map((user: any) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
