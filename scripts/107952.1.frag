#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Generate a random number using a seed value
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Improved 2D Perlin noise function
float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u); // smoother interpolation
    return mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
               mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
}


void main( void ) {
    // 定义屏幕空间的 UV 坐标
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 定义渐变颜色范围
    vec3 color1 = vec3(15.0/255.0, 21.0/255.0, 92.0/255.0); // #0F155C
    vec3 color2 = vec3(53.0/255.0, 5.0/255.0, 60.0/255.0);  // #35053C

    // 计算渐变颜色
    vec3 gradientColor = mix(color1, color2, uv.x);

    // 调整动态效果，通过时间变化
    float speed = 2.0; // 调整这个值以改变渐变速度
    gradientColor *= 0.5 + 0.5 * sin(speed * time);

    // 使用噪声函数来随机化渐变方向
    float randomOffset = noise(uv + time);
    uv = mod(uv + randomOffset, 1.0);

    // 输出最终颜色
    gl_FragColor = vec4(gradientColor, 1.0);
}
