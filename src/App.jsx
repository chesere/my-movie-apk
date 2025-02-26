import React from 'react'
import Search from './components/search'
import { useState, useEffect } from 'react';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjgxZDVmMWNlZTNkYjliNmM0ZjY4Nzc3YTJkMGUyNCIsIm5iZiI6MTc0MDA4NTY0Mi41ODgsInN1YiI6IjY3Yjc5OThhNDQ0ZGQ3ZmNlZmJhMjRjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GuBhbN5n4gbCk3wBXvnkHmtaIDrNsBZEqlPvDLXDedQ` 
  }
}

const App = () => {
  const [searchTerm,setSearchTerm]  = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const[debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
//debounces search term to prevent making too many API requests
//Waits for 500ms
  useDebounce(()=>setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query ='')=>{
    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query
      ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :  `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS); 

      if(!response.ok) { 
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      if(data.response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch Movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      updateSearchCount();
      
    } catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error Fetching movies. Please try again later.');
    }
    finally{
      setIsLoading(false); 
    }
  }

  useEffect(()=>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);
  return (
    <main>
      <div className="pattern"/>

        <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> you'll Enjoy Man Without the Hassle</h1>

        <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
        </header>
        <section className='all-movies'>
          <h2 className ="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ): errorMessage ? (
            <p className = 'text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map(movie =>(
                <MovieCard key={movie.id} movie={movie}/>
              ))}
            </ul>
          )}
        </section>
        
        </div>
    </main>
  )
}

export default App
