// 1. THÔNG TIN KẾT NỐI (Thay bằng thông tin của bạn)
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// 2. READ: Lấy danh sách từ Database
async function fetchTasks() {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false });

    if (error) console.error('Lỗi:', error);
    else renderTasks(data);
}

// 3. CREATE: Thêm mới
async function createTask() {
    const content = taskInput.value;
    if (!content) return;

    const { error } = await supabase
        .from('tasks')
        .insert([{ content }]);

    if (error) alert(error.message);
    else {
        taskInput.value = '';
        fetchTasks();
    }
}

// 4. UPDATE: Đánh dấu hoàn thành
async function toggleComplete(id, currentStatus) {
    await supabase
        .from('tasks')
        .update({ is_completed: !currentStatus })
        .eq('id', id);
    fetchTasks();
}

// 5. DELETE: Xóa
async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
}

function renderTasks(tasks) {
    taskList.innerHTML = tasks.map(task => `
        <li>
            <span style="text-decoration: ${task.is_completed ? 'line-through' : 'none'}" 
                  onclick="toggleComplete(${task.id}, ${task.is_completed})">
                ${task.content}
            </span>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Xóa</button>
        </li>
    `).join('');
}

// Chạy lần đầu khi load trang
fetchTasks();