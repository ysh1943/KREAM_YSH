package com.kream.kream.repositories;

import com.kream.kream.entities.PopularKeywordEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PopularKeywordsRepo extends CrudRepository<PopularKeywordEntity, String> {
}
