#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	float random = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
	//计算高斯分布
        float sigma = 0.9; // 高斯分布的标准差
        float mean = 0.; // 高斯分布的平均值
        float gaussian = (1.0 / (sigma * sqrt(2.0 * 3.14159))) * exp(-pow((random - mean),2.0)/(2.0*pow(sigma,2.0)));
        // 应用高斯噪声
        vec3 color = vec3(gaussian);

	gl_FragColor = vec4( color, 1.0 );

}