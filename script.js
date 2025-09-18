const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const messagesDiv = document.getElementById('messages');
const input = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

async function loadMessages() {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (messages) messages.forEach(msg => addMessage(msg.username, msg.message));
}

function addMessage(username, message) {
  const div = document.createElement('div');
  div.textContent = `${username}: ${message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendBtn.onclick = async () => {
  const msg = input.value.trim();
  if (!msg) return;
  await supabase.from('messages').insert([{ username: 'User', message: msg }]);
  input.value = '';
};

supabase.from('messages').on('INSERT', payload => {
  addMessage(payload.new.username, payload.new.message);
}).subscribe();

loadMessages();
