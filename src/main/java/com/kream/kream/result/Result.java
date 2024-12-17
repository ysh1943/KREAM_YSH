package com.kream.kream.result;

public interface Result {
    String NAME = "result";
    String name();

    default String nameToLower(){
        return this.name().toLowerCase();
    }
}
