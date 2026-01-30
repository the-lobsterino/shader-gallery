uniform lowp vec2 resolution;
void main() {
	gl_FragColor.rg = vec2(.312-length(gl_FragCoord.xy-.5* resolution.xy )/resolution.y)/.005;
}