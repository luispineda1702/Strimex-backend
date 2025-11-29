// src/media/media.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MediaService {
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  constructor(private readonly http: HttpService) {}

  private validateType(type: string) {
    if (type !== 'movie' && type !== 'tv') {
      throw new BadRequestException('Invalid type. Use: movie | tv');
    }
  }

  private map(item: any) {
    return {
      id: item.id,
      title: item.title || item.name,
      poster: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      rating: item.vote_average,
      releaseDate: item.release_date || item.first_air_date,
      overview: item.overview,
    };
  }

  async getPopular(type: string) {
    this.validateType(type);

    const url = `${this.baseUrl}/${type}/popular?api_key=${this.apiKey}&language=es-ES&page=1`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }

  async getTopRated(type: string) {
    this.validateType(type);

    const url = `${this.baseUrl}/${type}/top_rated?api_key=${this.apiKey}&language=es-ES&page=1`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }

  async search(type: string, query: string) {
    this.validateType(type);

    const url = `${this.baseUrl}/search/${type}?api_key=${this.apiKey}&language=es-ES&page=1&query=${query}`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }

  async getDetails(type: string, id: number) {
    this.validateType(type);

    const url = `${this.baseUrl}/${type}/${id}?api_key=${this.apiKey}&language=es-ES&append_to_response=credits`;
    const { data } = await this.http.axiosRef.get(url);

    return {
      ...this.map(data),
      genres: data.genres?.map((g) => g.name) ?? [],
      director:
        type === 'movie'
          ? data.credits.crew.find((c) => c.job === 'Director')?.name
          : null,
      actors: data.credits.cast.slice(0, 5).map((a) => a.name),
    };
  }

  async getProviders(type: string, id: number) {
    this.validateType(type);

    const url = `${this.baseUrl}/${type}/${id}/watch/providers?api_key=${this.apiKey}`;
    const { data } = await this.http.axiosRef.get(url);

    if (!data.results?.PE?.flatrate) return [];

    return data.results.PE.flatrate.map((p) => ({
      providerId: p.provider_id,
      name: p.provider_name,
      logo: `https://image.tmdb.org/t/p/w500${p.logo_path}`,
    }));
  }

  async getByGenre(type: string, genreId: number) {
    this.validateType(type);

    const url = `${this.baseUrl}/discover/${type}?api_key=${this.apiKey}&language=es-ES&page=1&with_genres=${genreId}`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }

  async getRecommended(type: string, id: number) {
    this.validateType(type);

    const url = `${this.baseUrl}/${type}/${id}/recommendations?api_key=${this.apiKey}&language=es-ES`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }

  async getTrending() {
    const url = `${this.baseUrl}/trending/all/week?api_key=${this.apiKey}&language=es-ES`;
    const { data } = await this.http.axiosRef.get(url);

    return data.results.map(this.map);
  }
}
