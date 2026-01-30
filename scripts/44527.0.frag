#version 150

in vec2 v_texcoord;
in vec4 v_colormod;
in vec4 v_color;

out vec4 out_color;

uniform sampler2D u_tex;
uniform int u_palette_id;


vec4 color_in_palette(int palette_id, vec4 color);

void main() {
    vec4 texture_color = texture(u_tex, v_texcoord);
    vec4 color_mod = vec4(1.0, 1.0, 1.0, 1.0) - v_colormod;
    vec4 final_color;
    if (v_color == vec4(0.0, 0.0, 0.0, 1.0)) {
        final_color = texture_color - color_mod;
    }
    else {
        final_color = v_color;
    }

    if(u_palette_id > 0) {
    	final_color = color_in_palette(u_palette_id, final_color);
    }

    out_color = final_color;
}

vec4 Color(int r, int g, int b) {
	return vec4(r / 255.0, g / 255.0, b / 255.0, 1.0);
}

vec4 palettes[2 * 4] = vec4[](
	vec4(1.0, 1.0, 1.0, 0.0),
		Color(248, 208, 136),
		Color(16, 168, 64),
		Color(0, 0, 0),
	vec4(1.0, 1.0, 1.0, 0.0),
		Color(0, 0, 0),
		Color(216, 0, 0),
		Color(248, 176, 48)
);

int color_id_in_palette(int palette_id, vec4 color) {
	for (int i = palette_id * 4 ; i < palette_id * 4 + 4 ; i++) {
		if( floor(palettes[i] + 0.5) == floor (color + 0.5)) {
			return i;
		}
	}
	return 0;
}

vec4 color_in_palette(int palette_id, vec4 color) {
	return palettes[palette_id * 4 + color_id_in_palette(0, color)];
}}