# Case11 Bench Results

- Date: 2025-12-27 12:31:24 +0800
- Node: v22.18.0
- pnpm: 9.12.2
- System: Darwin 769984d 24.3.0 Darwin Kernel Version 24.3.0: Thu Jan  2 20:24:23 PST 2025; root:xnu-11215.81.4~3/RELEASE_ARM64_T8122 arm64
- Commands: pnpm bench

## Raw Output
```


[bench] Running webpack+js ...

> @build-gym/11-plugin-loader@0.0.0 build:webpack /Users/carbon/Desktop/programms/infra/builder-gym/cases/11-plugin-loader
> webpack --mode production --config webpack.config.js

asset bundle.88e1a03f.js 18 KiB [emitted] [immutable] [minimized] (name: main)
asset i18n.keys.json 7.12 KiB [emitted]
asset index.html 198 bytes [emitted]
orphan modules 34.1 KiB [orphan] 123 modules
runtime modules 670 bytes 3 modules
./src/index.js + 123 modules 34.5 KiB [built] [code generated]
webpack 5.103.0 compiled successfully in 428 ms


[bench] Running rspack+js ...

> @build-gym/11-plugin-loader@0.0.0 build:rspack:js /Users/carbon/Desktop/programms/infra/builder-gym/cases/11-plugin-loader
> PLUGIN_IMPL=js rspack build -c rspack.config.js

Rspack compiled successfully in 67 ms


[bench] Running rspack+rust ...

> @build-gym/11-plugin-loader@0.0.0 build:rspack:rust /Users/carbon/Desktop/programms/infra/builder-gym/cases/11-plugin-loader
> PLUGIN_IMPL=rust rspack build -c rspack.config.js

Rspack compiled successfully in 32 ms


[bench] Running rspack+native ...

> @build-gym/11-plugin-loader@0.0.0 build:rspack:native /Users/carbon/Desktop/programms/infra/builder-gym/cases/11-plugin-loader
> PLUGIN_IMPL=native rspack build -c rspack.config.js

Rspack compiled successfully in 28 ms


[bench] Running rspack+define ...

> @build-gym/11-plugin-loader@0.0.0 build:rspack:define /Users/carbon/Desktop/programms/infra/builder-gym/cases/11-plugin-loader
> PLUGIN_IMPL=js STRIP_IMPL=define rspack build -c rspack.config.js

Rspack compiled successfully in 22 ms

[bench] i18n keys detected: 122

V ariant        Time(ms)  Size    Gzip   OK
webpack+js     1065      25.3KB  2.5KB  Y 
rspack+js      408       72.7KB  6.1KB  Y 
rspack+rust    342       72.7KB  6.1KB  Y 
rspack+native  327       72.7KB  6.1KB  Y 
rspack+define  326       69.2KB  6.6KB  Y
```
