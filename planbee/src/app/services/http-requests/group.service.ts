import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AddMembersToGroup,
  CreateGroup,
  GroupsItemsAction,
  NewNote,
  Note,
  RemoveMemberFromGroup,
  UpdateGroupName,
  UserData,
} from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupUrl = '/api/groups';

  constructor(private http: HttpClient) {}

  newGroup(credentials: CreateGroup): Observable<UserData> {
    return this.http.post<UserData>(this.groupUrl, credentials);
  }

  updateGroupName(credentials: UpdateGroupName): Observable<UserData> {
    return this.http.put<UserData>(
      `${this.groupUrl}/${credentials.groupId}`,
      credentials
    );
  }

  addMembersToGroup(credentials: AddMembersToGroup): Observable<UserData> {
    return this.http.post<UserData>(
      `${this.groupUrl}/${credentials.groupId}/members`,
      credentials
    );
  }

  removeMember(credentials: RemoveMemberFromGroup): Observable<UserData> {
    return this.http.request<UserData>(
      'DELETE',
      `${this.groupUrl}/${credentials.groupId}/members/`,
      {
        body: { memberEmails: credentials.membersEmail },
      }
    );
  }

  checkIfMemberExist(credentials: string): Observable<string> {
    return this.http.get<string>(this.groupUrl + '/' + credentials);
  }

  deleteGroup(groupId: string): Observable<UserData> {
    return this.http.delete<UserData>(`${this.groupUrl}/${groupId}`);
  }

  addItemToGroup(
    groupDetails: GroupsItemsAction,
    credentials: NewNote
  ): Observable<any> {
    return this.http.post<any>(
      `${this.groupUrl}/${groupDetails.groupId}/${groupDetails.category}`,
      credentials
    );
  }

  editItemInGroup(
    groupDetails: GroupsItemsAction,
    credentials: Note
  ): Observable<UserData> {
    return this.http.put<UserData>(
      `${this.groupUrl}/${groupDetails.groupId}/${groupDetails.category}/${credentials._id}`,
      credentials
    );
  }

  deleteItemFromGroup(groupDetails: GroupsItemsAction): Observable<UserData> {
    return this.http.delete<UserData>(
      `${this.groupUrl}/${groupDetails.groupId}/${groupDetails.category}/${groupDetails.taskId}`
    );
  }
}
