#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool closeTo(vec2 a, vec2 b) {
	if(distance(a, b) < 0.04) {
		return true;	
	}
	return false;
}

void main(void) {

	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	float opacity = 0.3;
	
	//opacity = fract(((time / (pos.x * pos.y)) / pos.x * pos.y));
	
	if(opacity > 0.7) {
		opacity = 1.0;
	}
	
	if(closeTo(pos, mouse)) {
		float new_opacity = 0.1 / (distance(pos, mouse) / 0.2);
		if(new_opacity > opacity) {
			opacity = new_opacity;
		}
	}
	
	vec3 water_color = vec3(0.0, 0.2, 1.0);
	vec3 grass_color = vec3(0.1, 1.0, 0.1);
	vec3 blood_color = vec3(1.0, 0.1, 0.1);
	vec3 rainbow_color = vec3(pos, 1.0);
	
	gl_FragColor = vec4(grass_color, opacity);
}

/*
TODO: implement pixelation effect without downscaling resolution

out vec4 FinalColor;
in vec2 FragUV;
uniform sampler2D Texture;

void main()
{
        float Pixels = 512.0;
        float dx = 15.0 * (1.0 / Pixels);
        float dy = 10.0 * (1.0 / Pixels);
        vec2 Coord = vec2(dx * floor(FragUV.x / dx),
                          dy * floor(FragUV.y / dy));
        FinalColor = texture(Texture, Coord);
}
*/