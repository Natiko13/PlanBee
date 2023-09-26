export interface Register {
  name: string;
  surname: string;
  email: string;
  password: string;
  privacyPolicy: boolean;
}

export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface UserData {
  name: string;
  surname: string;
  email: string;
  notes: Notes[];
  calendar: Event[];
  groups: Group[];
  trash: Trash[];
  profileOptions: ProfileOptions;
}

export interface Notes {
  _id: string;
  category: string;
  note: Note[];
}

export interface NewNote {
  category: string;
  title: string;
  content: string;
}

export interface UpdatedNote {
  _id: string;
  category: string;
  title: string;
  content: string;
}
export interface Note {
  _id: string;
  title: string;
  content: string;
  addedTime?: Date;
}

export interface Event {
  _id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  localization: string;
  description: string;
  color: string;
  eventClass: string;
}
export interface NewEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  localization: string;
  description: string;
  color: string;
  eventClass: string;
}

export interface Response {
  status: number;
  message: string;
}
export interface DeleteNote {
  category: string;
  noteId: string;
}

export interface Group {
  _id?: string;
  name: string;
  members: string[];
  notes: Note[];
  tasks: Note[];
}

export interface CreateGroup {
  groupName?: string;
  collaboratorEmails?: string[];
}

export interface UpdateGroupName {
  groupId: string;
  newName: string;
}

export interface AddMembersToGroup {
  groupId: string;
  newMembers: string[];
}

export interface RemoveMemberFromGroup {
  groupId: string;
  membersEmail: string[];
}

export interface GroupsItemsAction {
  groupId: string;
  category?: string;
  taskId?: string;
}

export interface UserSettings {
  name?: string;
  surname?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  profileOptions?: ProfileOptions;
}

export interface ProfileOptions {
  background?: string;
  avatar?: string;
  theme?: string;
}

export interface Trash {
  _id: string;
  originalCategory: string;
  note: Note[];
}

export interface RestoreNote {
  originalCategory: string;
  noteId: string;
}
