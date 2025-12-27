use napi::bindgen_prelude::*;
use napi_derive::napi;
use regex::Regex;
use std::collections::HashMap;

#[napi(object)]
pub struct KeyCount { pub key: String, pub count: u32 }

#[napi]
pub fn collect_i18n_keys(sources: Vec<String>) -> Vec<KeyCount> {
  let re_s = Regex::new(r"\bt\(\s*'([^']+?)'\s*[,)]").unwrap();
  let re_d = Regex::new(r#"\bt\(\s*\"([^\"]+?)\"\s*[,)]"#).unwrap();
  let mut map: HashMap<String, u32> = HashMap::new();
  for src in sources.iter() {
    for cap in re_s.captures_iter(src) {
      let k = cap.get(1).unwrap().as_str().to_string();
      *map.entry(k).or_insert(0) += 1;
    }
    for cap in re_d.captures_iter(src) {
      let k = cap.get(1).unwrap().as_str().to_string();
      *map.entry(k).or_insert(0) += 1;
    }
  }
  let mut v: Vec<KeyCount> = map.into_iter().map(|(key, count)| KeyCount{ key, count }).collect();
  v.sort_by(|a, b| a.key.cmp(&b.key));
  v
}
