// データ管理モジュール
export const membersData = [
  {
    name: "河合 未希",
    role: "主任",
    familyComposition: "主人・長女（7歳）次女（3歳）長男（1歳）私の5人家族"
  },
  {
    name: "川村 奈緒子", 
    role: "主任",
    familyComposition: "主人、双子の長女（2歳）、次男（2歳）、私の4人家族"
  },
  {
    name: "林 桂子",
    role: "主任", 
    familyComposition: "主人・長女（19歳）長男（16歳）次男（7歳）私の5人家族"
  },
  {
    name: "ファム ティフーン",
    role: "メンバー",
    familyComposition: "主人、長女（1歳）、私の3人家族"
  },
  {
    name: "阿川 すみれ",
    role: "メンバー", 
    familyComposition: "主人、長男（おなかの中）、私の3人家族"
  }
];

export const activitiesData = [
  {
    id: "activity-001",
    date: "2025年6月11日",
    title: "第一回ママさん会キックオフ",
    description: "ママさんが「働きやすい環境」で活躍できるよう、課題を共有し、今後の方向性を話し合いました。会の意義やゴールの共有、自己紹介、理想の働き方のイメージについて議論しました。",
    participants: ["河合 未希", "川村 奈緒子", "林 桂子", "ファム ティフーン", "阿川 すみれ"],
    nextMeeting: "未定"
  }
];

// ローカルストレージからデータを読み込み
export const loadActivitiesFromStorage = () => {
  const stored = localStorage.getItem('mamasankai-activities');
  return stored ? JSON.parse(stored) : activitiesData;
};

// ローカルストレージにデータを保存
export const saveActivitiesToStorage = (activities) => {
  localStorage.setItem('mamasankai-activities', JSON.stringify(activities));
};

// 新しい活動を追加
export const addActivity = (activity) => {
  const activities = loadActivitiesFromStorage();
  const newActivity = {
    ...activity,
    id: `activity-${Date.now()}`,
    date: activity.date || new Date().toLocaleDateString('ja-JP')
  };
  activities.unshift(newActivity);
  saveActivitiesToStorage(activities);
  return activities;
};

// 活動を更新
export const updateActivity = (id, updatedActivity) => {
  const activities = loadActivitiesFromStorage();
  const index = activities.findIndex(activity => activity.id === id);
  if (index !== -1) {
    activities[index] = { ...activities[index], ...updatedActivity };
    saveActivitiesToStorage(activities);
  }
  return activities;
};