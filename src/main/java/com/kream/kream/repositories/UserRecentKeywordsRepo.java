package com.kream.kream.repositories;

import com.kream.kream.entities.RecentKeywordEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRecentKeywordsRepo extends CrudRepository<RecentKeywordEntity, String> {

}
