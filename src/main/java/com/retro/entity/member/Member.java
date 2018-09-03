package com.retro.entity.member;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;
import javax.persistence.GenerationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.retro.entity.action.Action;
import com.retro.entity.team.Team;

@Data
@Entity
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(name = "memberEntityGraph", includeAllAttributes = true)
public class Member {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String userID;
  private String firstName;
  private String lastName;

  private String video;
  private String email;

  @OneToMany(mappedBy = "member")
  private List<Action> actions;

  @ManyToMany(mappedBy = "members")
  private List<Team> teams;
}
