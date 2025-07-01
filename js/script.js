import { membersData, loadActivitiesFromStorage, addActivity, updateActivity } from './data.js';

class MemberManager {
  loadMembers() {
    return membersData;
  }

  displayMembers(members) {
    const container = document.getElementById('members-container');
    if (!container) return;

    container.innerHTML = members.map(member => `
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center mr-4">
            <span class="text-pink-600 text-xl font-bold">${member.name.charAt(0)}</span>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-800">${member.name}</h3>
            <span class="text-pink-600 font-medium">${member.role}</span>
          </div>
        </div>
        <p class="text-gray-600 leading-relaxed">${member.familyComposition}</p>
      </div>
    `).join('');
  }
}

class ActivityManager {
  loadActivities() {
    return loadActivitiesFromStorage();
  }

  displayActivities(activities) {
    const container = document.getElementById('activities-container');
    if (!container) return;

    if (activities.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">まだ活動報告がありません</p>
        </div>
      `;
      return;
    }

    container.innerHTML = activities.map(activity => `
      <article class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <header class="mb-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold text-gray-800">${activity.title}</h3>
            <time class="text-pink-600 font-medium">${activity.date}</time>
          </div>
        </header>
        <div class="mb-4">
          <p class="text-gray-700 leading-relaxed">${activity.description}</p>
        </div>
        <div class="border-t pt-4">
          <div class="mb-2">
            <span class="text-sm font-medium text-gray-600">参加者：</span>
            <span class="text-sm text-gray-700">${activity.participants.join('、')}</span>
          </div>
          ${activity.nextMeeting ? `
            <div>
              <span class="text-sm font-medium text-gray-600">次回予定：</span>
              <span class="text-sm text-gray-700">${activity.nextMeeting}</span>
            </div>
          ` : ''}
        </div>
        <div class="mt-4 flex justify-end">
          <button onclick="editActivity('${activity.id}')" 
                  class="text-pink-600 hover:text-pink-800 text-sm font-medium">
            編集
          </button>
        </div>
      </article>
    `).join('');
  }

  async addActivity(activity) {
    try {
      const activities = addActivity(activity);
      this.displayActivities(activities);
      return activities;
    } catch (error) {
      console.error('活動追加エラー:', error);
      throw error;
    }
  }

  async updateActivity(id, activity) {
    try {
      const activities = updateActivity(id, activity);
      this.displayActivities(activities);
      return activities;
    } catch (error) {
      console.error('活動更新エラー:', error);
      throw error;
    }
  }
}

class NavigationManager {
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        this.setActiveTab(targetId);
      });
    });

    // 初期表示
    this.setActiveTab('home');
  }

  setActiveTab(tabName) {
    // ナビゲーションのアクティブ状態を更新
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('border-pink-500', 'text-pink-600');
      link.classList.add('border-transparent', 'text-gray-500');
    });

    const activeLink = document.querySelector(`[data-target="${tabName}"]`);
    if (activeLink) {
      activeLink.classList.remove('border-transparent', 'text-gray-500');
      activeLink.classList.add('border-pink-500', 'text-pink-600');
    }

    // セクションの表示/非表示を切り替え
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.add('hidden');
    });

    const activeSection = document.getElementById(tabName);
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }

    // メンバーページの場合、メンバー情報を表示
    if (tabName === 'members') {
      const memberManager = new MemberManager();
      memberManager.displayMembers(memberManager.loadMembers());
    }

    // 活動報告ページの場合、活動情報を表示
    if (tabName === 'activities') {
      const activityManager = new ActivityManager();
      activityManager.displayActivities(activityManager.loadActivities());
    }
  }
}

// グローバル関数
window.editActivity = (id) => {
  const activities = loadActivitiesFromStorage();
  const activity = activities.find(a => a.id === id);
  if (!activity) return;

  const newTitle = prompt('タイトルを編集:', activity.title);
  if (newTitle === null) return;

  const newDescription = prompt('内容を編集:', activity.description);
  if (newDescription === null) return;

  const newNextMeeting = prompt('次回予定を編集:', activity.nextMeeting || '');

  const activityManager = new ActivityManager();
  activityManager.updateActivity(id, {
    title: newTitle,
    description: newDescription,
    nextMeeting: newNextMeeting
  });
};

window.showAddActivityForm = () => {
  const modal = document.getElementById('add-activity-modal');
  modal.classList.remove('hidden');
};

window.hideAddActivityForm = () => {
  const modal = document.getElementById('add-activity-modal');
  modal.classList.add('hidden');
  document.getElementById('add-activity-form').reset();
};

window.submitActivity = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const activity = {
    title: formData.get('title'),
    description: formData.get('description'),
    participants: formData.get('participants').split('、').map(p => p.trim()),
    nextMeeting: formData.get('nextMeeting') || ''
  };

  try {
    const activityManager = new ActivityManager();
    await activityManager.addActivity(activity);
    window.hideAddActivityForm();
    
    // 成功メッセージ
    const message = document.createElement('div');
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    message.textContent = '活動報告を追加しました';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  } catch (error) {
    alert('活動報告の追加に失敗しました');
  }
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  const navigationManager = new NavigationManager();
  navigationManager.initNavigation();
});