#version 450

layout (local_size_x = 16, local_size_y = 16) in;

layout (binding = 0) uniform sampler2D yuvTexture;
layout (binding = 1) writeonly uniform image2D resultImage;

const vec3 kRcoeff = vec3(1.0, 0.0, 1.403);
const vec3 kGcoeff = vec3(1.0, -0.344, -0.714);
const vec3 kBcoeff = vec3(1.0, 1.770, 0.0);

void main() {
    ivec2 imageSize = imageSize(resultImage);
    vec2 texCoord = vec2(gl_GlobalInvocationID.xy) / vec2(imageSize);

    float y = texture(yuvTexture, texCoord).r;
    vec2 uv = texture(yuvTexture, vec2(texCoord.x, texCoord.y + 0.5)).rg - vec2(0.5, 0.5);

    vec3 yuv = vec3(y, uv.x, uv.y);
    vec3 color = vec3(dot(yuv, kRcoeff), dot(yuv, kGcoeff), dot(yuv, kBcoeff));

    imageStore(resultImage, ivec2(gl_GlobalInvocationID.xy), vec4(color, 1.0));
}
