function initChat() {
  const supabaseUrl = 'https://vobuxnfqelwjhebkjrwt.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYnV4bmZxZWx3amhlYmtqcnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTcxOTYsImV4cCI6MjA3MzczMzE5Nn0.z5jijKIbhOnIHnJFpg1EzhA_RCqVEQWxpLwmWjz1FQ8';

  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const messagesDiv = document.getElementById('messages');
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');

  function addMessage(username, message) {
    const div = document.createElement('div');
    div.textContent = `${username}: ${message}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function loadMessages() {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (messages) messages.forEach(msg => addMessage(msg.username, msg.message));
    if (error) console.error(error);
  }

  sendBtn.onclick = async () => {
    const msg = input.value.trim();
    if (!msg) return;
    const { error } = await supabase.from('messages').insert([{ username: 'User', message: msg }]);
    if (!error) input.value = '';
    else console.error(error);
  };

  supabase.from('messages').on('INSERT', payload => {
    addMessage(payload.new.username, payload.new.message);
  }).subscribe();

  loadMessages();
}

// Wait until the Supabase library is loaded
function waitForSupabase() {
  if (window.supabase) {
    initChat();
  } else {
    setTimeout(waitForSupabase, 50);
  }
}

waitForSupabase();
